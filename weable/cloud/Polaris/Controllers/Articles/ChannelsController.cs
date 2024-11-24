using System.Data.Entity;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers;
using Molecule.Models;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Polaris;
using Polaris.Business.Services;

namespace Polaris.Controllers.Articles;

[ApiController]
[Authorize]
public class ChannelsController(ILogger<ChannelsController> logger, DatabaseContext configuration,
    ModelService modelService)
    : ControllerBase
{
    private readonly ILogger<ChannelsController> _logger = logger;

    [Route("/articles/channels/{urn}")]
    [HttpGet]
    [AllowAnonymous]
    public PSChannelModel? Get([FromRoute] string urn)
    {
        return modelService.GetByKey<PSChannelModel>(urn);
    }

    [Route("/articles/channels/{pk}")]
    [HttpDelete]
    public async Task<PModifyResult> Delete([FromRoute] string pk)
    {
        if (!Guid.TryParse(pk, out var uid)) throw new PLBizException("频道不存在");
        var model = await configuration.Channels.FirstOrDefaultAsync(m => m.Uid == uid);
        if (model == null) throw new PLBizException("频道不存在");
        configuration.Channels.Remove(model);
        var changes = await configuration.SaveChangesAsync();

        return new PModifyResult { Changes = changes };
    }

    [Route("/articles/channels")]
    [HttpGet]
    [AllowAnonymous]
    public MSelectResult<PSChannelModel> Select()
    {
        var queryHelper = new MQueryHelper(Request.Query);
        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);
        var models = configuration.Channels.OrderByDescending(o => o.UpdateTime).Skip(offset).Take(limit).ToList();
        var totalCount = configuration.Channels.Count();

        return new MSelectResult<PSChannelModel>
        {
            Range = models,
            Count = totalCount
        };
    }

    [Route("/articles/channels/{urn}/posts")]
    [AllowAnonymous]
    public MSelectResult<PSArticleModel> SelectPosts([FromRoute] string urn)
    {
        var queryHelper = new MQueryHelper(Request.Query);
        var keyword = queryHelper.GetString("keyword");
        var sort = queryHelper.GetString("sort") ?? "latest";
        var filter = queryHelper.GetString("filter") ?? "all";

        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var channelModel = modelService.GetByKey<PSChannelModel>(urn);
        if (channelModel == null) throw new PLBizException("频道不存在");

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*
from polaris.articles as a
where a.channel = @channel
");
        parameters.Add("channel", channelModel.Uid);

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
            Range = models,
            Count = totalCount ?? 0 
        };
    }

    [Route("/articles/channels")]
    [HttpPost]
    public async Task<PModifyResult> Insert([FromBody] PSChannelModel request)
    {
        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name)) throw new PLBizException("用户未登录");
        var model = new PSChannelModel
        {
            Uid = MIDHelper.Default.NewUUIDv7(),
            Name = request.Name,
            CreateTime = DateTime.UtcNow,
            UpdateTime = DateTime.UtcNow,
            Owner = Guid.Empty,
            Description = request.Description,
            Image = request.Image
        };
        await configuration.Channels.AddAsync(model);
        await configuration.SaveChangesAsync();

        return new PModifyResult { Uid = model.Uid };
    }

    [Route("/articles/channels/{pk}")]
    [HttpPut]
    public async Task<PModifyResult> Update([FromBody] PSChannelModel request)
    {
        var model = await configuration.Channels.FirstOrDefaultAsync(m => m.Uid == request.Uid);
        if (model == null) throw new PLBizException("频道不存在");

        model.Name = request.Name;
        var changes = await configuration.SaveChangesAsync();

        return new PModifyResult { Changes = changes };
    }

    [Route("/articles/channels/{channel}/relation/{post}")]
    [HttpPost]
    public PModifyResult Share([FromRoute] Guid channel, [FromRoute] Guid post)
    {
        var model = configuration.Channels.FirstOrDefault(m => m.Uid == channel);
        if (model == null) throw new PLBizException("频道不存在");
        var user = HttpContext.User;
        var creatorPk = Guid.Empty;
        if (user.Identity != null && !string.IsNullOrEmpty(user.Identity.Name))
        {
            var account = configuration.Accounts.FirstOrDefault(o => o.Username == user.Identity.Name);
            if (account != null) creatorPk = account.Uid;
        }

        var relation = new RelationModel
        {
            Uid = MIDHelper.Default.NewUUIDv7(),
            Source = model.Uid,
            Target = post,
            Direction = "cta",
            CreateTime = DateTime.UtcNow,
            UpdateTime = DateTime.UtcNow,
            Owner = creatorPk,
            Discover = 0
        };
        configuration.Relations.Add(relation);
        var changes = configuration.SaveChanges();

        return new PModifyResult { Changes = changes };
    }
}