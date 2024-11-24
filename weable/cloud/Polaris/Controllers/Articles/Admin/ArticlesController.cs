using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers;
using Molecule.Models;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Polaris;

namespace Polaris.Controllers.Articles.Admin;

[ApiController]
public class PSArticleAdminController(DatabaseContext configuration) : ControllerBase
{
    [Route("/polaris/admin/articles")]
    [AllowAnonymous]
    public MSelectResult<PSArticleModel> SelectArticles()
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
select a.*, c.name as channel_name, u.nickname as owner_name
from polaris.articles as a left join polaris.channels as c on a.channel = c.uid
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

        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(configuration, countSqlText, parameters);

        sqlBuilder.Append(sort == "read" ? @" order by a.discover desc" : @" order by a.update_time desc");

        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<PSArticleModel>(configuration, querySqlText, parameters);
        
        var models = modelsQuery.ToList();
        
        return new MSelectResult<PSArticleModel>
        { 
            Page = page,
            Size = size,
            Range = models,
            Count = totalCount ?? 0 
        };
    }

    [Route("/admin/relations")]
    [HttpGet]
    public MSelectResult<RelationFullModel<PSChannelModel, HistoryModel>> Select()
    {
        var queryHelper = new MQueryHelper(Request.Query);
        var channel = queryHelper.GetString("channel");

        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select r.*,  row_to_json(c.*) as source_model, row_to_json(h.*) as target_model
from relations as r
    left join channels as c on r.source = c.uid
    left join history as h on r.target = h.pk
where r.status = 0 
");
        if (!string.IsNullOrEmpty(channel))
        {
            sqlBuilder.Append(@" and r.source = @channel");
            parameters.Add("@channel", channel);
        }

        var countSqlText = $@"
select count(1) from ({sqlBuilder}) as temp;";

        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(configuration, countSqlText, parameters);

        sqlBuilder.Append(@" order by r.update_time asc");
        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery =
            DatabaseContextHelper.RawSqlQuery<RelationFullModel<PSChannelModel, HistoryModel>>(configuration, querySqlText,
                parameters);

        var models = modelsQuery.ToList();

        return new MSelectResult<RelationFullModel<PSChannelModel, HistoryModel>>
        {
            Range = models,
            Count = totalCount ?? 0
        };
    }

}