using System.Data.Entity;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers;
using Molecule.Models;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Venus;
using Polaris.Business.Services;

namespace Polaris.Controllers.Pictures;

[ApiController]
[Authorize]
public class ChannelsController(DatabaseContext configuration,
    ModelService modelService)
    : ControllerBase
{
    [Route("/pictures/channels")]
    [HttpGet]
    [AllowAnonymous]
    public MSelectResult<NSChannelModel> Select()
    {
        var queryHelper = new MQueryHelper(Request.Query);
        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);
        var models = configuration.NSChannels.OrderByDescending(o => o.UpdateTime).Skip(offset).Take(limit).ToList();
        var totalCount = configuration.NSChannels.Count();

        return new MSelectResult<NSChannelModel>
        {
            Range = models,
            Count = totalCount
        };
    }

    [Route("/pictures/channels/{urn}/pictures")]
    [AllowAnonymous]
    public MSelectResult<NSPictureModel> SelectPictures([FromRoute] string urn)
    {
        var queryHelper = new MQueryHelper(Request.Query);
        var keyword = queryHelper.GetString("keyword");
        var sort = queryHelper.GetString("sort") ?? "latest";
        var filter = queryHelper.GetString("filter") ?? "all";

        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var channelModel = modelService.GetByKey<NSChannelModel>(urn);
        if (channelModel == null) throw new PLBizException("频道不存在");

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*
from venus.pictures as a
where a.channel = @channel
");
        parameters.Add("@channel", channelModel.Uid);

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

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<NSPictureModel>(configuration, querySqlText, parameters);
        
        var models = modelsQuery.ToList();


        return new MSelectResult<NSPictureModel>
        {
            Range = models,
            Count = totalCount ?? 0
        };
    }
}