using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers;
using Molecule.Models;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Community;

namespace Polaris.Areas.Personal.Controllers;

[ApiController]
public class PsPhotoAdminController(
    IDatabaseContextFactory databaseFactory,
    IConfiguration configuration) : ControllerBase
{
    [Route("/stargate/personal/images")]
    [AllowAnonymous]
    public MSelectResult<CmFileModel> SelectPhotos()
    {
        var queryHelper = new MQueryHelper(Request.Query);
        var keyword = queryHelper.GetString("keyword");
        var sort = queryHelper.GetString("sort") ?? "latest";
        var filter = queryHelper.GetString("filter") ?? "all";

        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*, c.name as channel_name, u.nickname as owner_name, f.url as url
from community.images as a left join community.channels as c on a.channel = c.uid
    left join community.files as f on a.uid = f.uid
    left join public.accounts as u on a.owner = u.uid
where a.uid is not null 
");

        if (keyword != null && !string.IsNullOrEmpty(keyword))
        {
            sqlBuilder.Append(@" and (a.title like @keyword or a.description like @keyword)");
            parameters.Add("@keyword", $@"%{keyword}%");
        }

        if (filter == "month")
        {
            sqlBuilder.Append(@" and a.update_time > @update_time");
            parameters.Add("@update_time", DateTime.UtcNow.AddMonths(-1));
        }
        else if (filter == "year")
        {
            sqlBuilder.Append(@" and a.update_time > @update_time");
            parameters.Add("@update_time", DateTime.UtcNow.AddYears(-1));
        }

        var countSqlText = $@"
select count(1) from ({sqlBuilder}) as temp;";

        using var secondContext = databaseFactory.CreateDbContext();

        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(secondContext, countSqlText, parameters);

        sqlBuilder.Append(sort == "read" ? @" order by a.discover desc" : @" order by a.update_time desc");

        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<CmFileModel>(secondContext, querySqlText, parameters);

        var models = modelsQuery.ToList();

        var storageUrl = configuration["PUBLIC_STORAGE_URL"]
                         ?? throw new InvalidOperationException("PUBLIC_STORAGE_URL not found in First DB.");

        foreach (var model in models)
        {
            if (string.IsNullOrEmpty(model.Url)) continue;
            model.Url = model.Url.Replace("storage:/", storageUrl);
        }

        return new MSelectResult<CmFileModel>
        {
            Code = Codes.Ok,
            Data =
                new MSelectData<CmFileModel>
                {
                    Page = page,
                    Size = size,
                    Range = models,
                    Count = totalCount ?? 0
                }
        };
    }
}