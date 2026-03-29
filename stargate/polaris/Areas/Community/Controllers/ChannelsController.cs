using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Molecule.Helpers;
using Molecule.Models;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Community;
using Polaris.Business.Models.Protocol;

namespace Polaris.Areas.Community.Controllers;

[Area("Community")]
[ApiController]
[Authorize]
public class ChannelsController(IDatabaseContextFactory databaseFactory) : ControllerBase
{
    [Route("/stargate/community/channels")]
    [HttpGet]
    public async Task<MSelectResult<CmChannelModel>> SelectChannels()
    {
        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            return new MSelectResult<CmChannelModel>
            {
                Code = Codes.Error,
                Message = "User not authenticated",
                Data = new MSelectData<CmChannelModel>
                {
                    Page = 1,
                    Size = 10,
                    Range = new List<CmChannelModel>(),
                    Count = 0
                }
            };

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts.FirstOrDefaultAsync(o => o.Username == user.Identity.Name);
        if (account == null)
            return new MSelectResult<CmChannelModel>
            {
                Code = Codes.Error,
                Message = "Account not found6",
                Data = new MSelectData<CmChannelModel>
                {
                    Page = 1,
                    Size = 10,
                    Range = new List<CmChannelModel>(),
                    Count = 0
                }
            };

        var queryHelper = new MQueryHelper(Request.Query);
        var keyword = queryHelper.GetString("keyword");

        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select c.*
from community.channels as c
where c.uid is not null and c.owner = @owner
");
        parameters.Add("@owner", account.Uid);

        if (keyword != null && !string.IsNullOrEmpty(keyword))
        {
            sqlBuilder.Append(@" and (c.name like @keyword or c.description like @keyword)");
            parameters.Add("@keyword", $@"%{keyword}%");
        }

        var countSqlText = $@"
select count(1) from ({sqlBuilder}) as temp;";

        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(databaseContext, countSqlText, parameters);

        sqlBuilder.Append(@" order by c.update_time desc");

        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<CmChannelModel>(databaseContext, querySqlText, parameters);

        var models = modelsQuery.ToList();

        return new MSelectResult<CmChannelModel>
        {
            Code = Codes.Ok,
            Data =
                new MSelectData<CmChannelModel>
                {
                    Page = page,
                    Size = size,
                    Range = models,
                    Count = totalCount ?? 0
                }
        };
    }

    [Route("/stargate/community/channels/{uid}")]
    [HttpGet]
    public async Task<MGetResult<CmChannelModel>> GetChannel([FromRoute] string uid)
    {
        if (!Guid.TryParse(uid, out var channelUid))
            return new MGetResult<CmChannelModel>
            {
                Code = Codes.Error,
                Message = "Invalid channel ID",
                Data = new CmChannelModel()
            };

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            return new MGetResult<CmChannelModel>
            {
                Code = Codes.Error,
                Message = "User not authenticated",
                Data = new CmChannelModel()
            };

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts.FirstOrDefaultAsync(o => o.Username == user.Identity.Name);
        if (account == null)
            return new MGetResult<CmChannelModel>
            {
                Code = Codes.Error,
                Message = "Account not found7",
                Data = new CmChannelModel()
            };

        var channel = await databaseContext.CommunityChannels
            .Where(c => c.Uid == channelUid && c.Owner == account.Uid)
            .FirstOrDefaultAsync();

        if (channel == null)
            return new MGetResult<CmChannelModel>
            {
                Code = Codes.Error,
                Message = "Channel not found",
                Data = new CmChannelModel()
            };

        return new MGetResult<CmChannelModel>
        {
            Code = Codes.Ok,
            Data = channel
        };
    }

    [Route("/stargate/community/channels")]
    [HttpPost]
    public async Task<StInsertResult> InsertChannel([FromBody] CmChannelModel request)
    {
        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            throw new PLBizException("User not authenticated");

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts.FirstOrDefaultAsync(o => o.Username == user.Identity.Name);
        if (account == null) throw new PLBizException("Account not found");

        var now = DateTime.UtcNow;
        var channelUid = MIDHelper.Default.NewUUIDv7();

        var channel = new CmChannelModel
        {
            Uid = channelUid,
            Name = request.Name ?? "",
            Description = request.Description ?? "",
            Image = request.Image ?? "",
            Owner = account.Uid,
            CreateTime = now,
            UpdateTime = now
        };

        await databaseContext.CommunityChannels.AddAsync(channel);
        await databaseContext.SaveChangesAsync();

        return new StInsertResult
        {
            Code = Codes.Ok,
            Message = "Channel created successfully",
            Data = channelUid.ToString()
        };
    }

    [Route("/stargate/community/channels/{uid}")]
    [HttpPut]
    public async Task<StUpdateResult> UpdateChannel([FromRoute] string uid, [FromBody] CmChannelModel request)
    {
        if (!Guid.TryParse(uid, out var channelUid)) throw new PLBizException("Invalid channel ID");

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            throw new PLBizException("User not authenticated");

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts.FirstOrDefaultAsync(o => o.Username == user.Identity.Name);
        if (account == null) throw new PLBizException("Account not found");

        var channel = await databaseContext.CommunityChannels
            .Where(c => c.Uid == channelUid && c.Owner == account.Uid)
            .FirstOrDefaultAsync();

        if (channel == null) throw new PLBizException("Channel not found or unauthorized");

        channel.Name = request.Name ?? channel.Name;
        channel.Description = request.Description ?? channel.Description;
        channel.Image = request.Image ?? channel.Image;
        channel.UpdateTime = DateTime.UtcNow;

        var changes = await databaseContext.SaveChangesAsync();

        return new StUpdateResult
        {
            Code = Codes.Ok,
            Message = "Channel updated successfully",
            Data = channelUid.ToString()
        };
    }

    [Route("/stargate/community/channels/{uid}")]
    [HttpDelete]
    public async Task<PLExceptionResult> DeleteChannel([FromRoute] string uid)
    {
        if (!Guid.TryParse(uid, out var channelUid))
            return new PLExceptionResult
            {
                Code = Codes.Error,
                Message = "Invalid channel ID"
            };

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            return new PLExceptionResult
            {
                Code = Codes.Error,
                Message = "User not authenticated"
            };

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts.FirstOrDefaultAsync(o => o.Username == user.Identity.Name);
        if (account == null)
            return new PLExceptionResult
            {
                Code = Codes.Error,
                Message = "Account not found8"
            };

        var channel = await databaseContext.CommunityChannels
            .Where(c => c.Uid == channelUid && c.Owner == account.Uid)
            .FirstOrDefaultAsync();

        if (channel == null)
            return new PLExceptionResult
            {
                Code = Codes.Error,
                Message = "Channel not found or unauthorized"
            };

        databaseContext.CommunityChannels.Remove(channel);
        var changes = await databaseContext.SaveChangesAsync();

        return new PLExceptionResult
        {
            Code = Codes.Ok,
            Message = "Channel deleted successfully"
        };
    }
}