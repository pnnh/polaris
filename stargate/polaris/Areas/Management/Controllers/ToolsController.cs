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

namespace Polaris.Areas.Management.Controllers;

[Area("Management")]
[ApiController]
[Authorize]
public class ToolsController(IDatabaseContextFactory databaseFactory) : ControllerBase
{
    private static readonly Guid RootUserUid = Guid.Parse("a75a0ada-16c4-11f1-987b-42a82e58ed77");

    [Route("/stargate/management/tools")]
    [HttpGet]
    public async Task<MSelectResult<CmToolModel>> SelectTools()
    {
        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            return ErrorSelectResult("User not authenticated");

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts
            .FirstOrDefaultAsync(o => o.Username == user.Identity.Name);

        if (account == null)
            return ErrorSelectResult("Account not found");

        if (account.Uid != RootUserUid)
            return ErrorSelectResult("Permission denied: root user required");

        var queryHelper = new MQueryHelper(Request.Query);
        var keyword = queryHelper.GetString("keyword");
        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select t.*
from community.tools as t
where t.uid is not null
");

        if (!string.IsNullOrEmpty(keyword))
        {
            sqlBuilder.Append(@" and (t.title like @keyword or t.description like @keyword or t.name like @keyword)");
            parameters.Add("@keyword", $@"%{keyword}%");
        }

        var countSql = $@"select count(1) from ({sqlBuilder}) as temp;";
        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(databaseContext, countSql, parameters);

        sqlBuilder.Append(@" order by t.update_time desc");
        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var models = DatabaseContextHelper
            .RawSqlQuery<CmToolModel>(databaseContext, sqlBuilder.ToString(), parameters)
            .ToList();

        return new MSelectResult<CmToolModel>
        {
            Code = Codes.Ok,
            Data = new MSelectData<CmToolModel>
            {
                Page = page,
                Size = size,
                Range = models,
                Count = totalCount ?? 0
            }
        };
    }

    [Route("/stargate/management/tools/{uid}")]
    [HttpGet]
    public async Task<MGetResult<CmToolModel>> GetTool([FromRoute] string uid)
    {
        if (!Guid.TryParse(uid, out var toolUid))
            return new MGetResult<CmToolModel>
                { Code = Codes.Error, Message = "Invalid tool ID", Data = new CmToolModel() };

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            return new MGetResult<CmToolModel>
                { Code = Codes.Error, Message = "User not authenticated", Data = new CmToolModel() };

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts
            .FirstOrDefaultAsync(o => o.Username == user.Identity.Name);

        if (account == null)
            return new MGetResult<CmToolModel>
                { Code = Codes.Error, Message = "Account not found", Data = new CmToolModel() };

        if (account.Uid != RootUserUid)
            return new MGetResult<CmToolModel>
                { Code = Codes.Error, Message = "Permission denied: root user required", Data = new CmToolModel() };

        var tool = await databaseContext.CommunityTools.FirstOrDefaultAsync(t => t.Uid == toolUid);
        if (tool == null)
            return new MGetResult<CmToolModel>
                { Code = Codes.Error, Message = "Tool not found", Data = new CmToolModel() };

        return new MGetResult<CmToolModel> { Code = Codes.Ok, Data = tool };
    }

    [Route("/stargate/management/tools")]
    [HttpPost]
    public async Task<StInsertResult> InsertTool([FromBody] CmToolModel request)
    {
        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            throw new PLBizException("User not authenticated");

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts
            .FirstOrDefaultAsync(o => o.Username == user.Identity.Name);

        if (account == null) throw new PLBizException("Account not found");
        if (account.Uid != RootUserUid) throw new PLBizException("Permission denied: root user required");

        var now = DateTime.UtcNow;
        var toolUid = MIDHelper.Default.NewUUIDv7();

        var tool = new CmToolModel
        {
            Uid = toolUid,
            Title = request.Title ?? "",
            Name = request.Name ?? "",
            Keywords = request.Keywords ?? "",
            Description = request.Description ?? "",
            Status = request.Status,
            Cover = request.Cover ?? "",
            Owner = account.Uid,
            Discover = 0,
            Version = request.Version,
            Url = request.Url,
            Lang = request.Lang,
            CreateTime = now,
            UpdateTime = now
        };

        await databaseContext.CommunityTools.AddAsync(tool);
        await databaseContext.SaveChangesAsync();

        return new StInsertResult
        {
            Code = Codes.Ok,
            Message = "Tool created successfully",
            Data = toolUid.ToString()
        };
    }

    [Route("/stargate/management/tools/{uid}")]
    [HttpPut]
    public async Task<StUpdateResult> UpdateTool([FromRoute] string uid, [FromBody] CmToolModel request)
    {
        if (!Guid.TryParse(uid, out var toolUid)) throw new PLBizException("Invalid tool ID");

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            throw new PLBizException("User not authenticated");

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts
            .FirstOrDefaultAsync(o => o.Username == user.Identity.Name);

        if (account == null) throw new PLBizException("Account not found");
        if (account.Uid != RootUserUid) throw new PLBizException("Permission denied: root user required");

        var tool = await databaseContext.CommunityTools.FirstOrDefaultAsync(t => t.Uid == toolUid);
        if (tool == null) throw new PLBizException("Tool not found");

        tool.Title = request.Title ?? tool.Title;
        tool.Name = request.Name ?? tool.Name;
        tool.Keywords = request.Keywords ?? tool.Keywords;
        tool.Description = request.Description ?? tool.Description;
        tool.Status = request.Status;
        tool.Cover = request.Cover ?? tool.Cover;
        tool.Version = request.Version ?? tool.Version;
        tool.Url = request.Url ?? tool.Url;
        tool.Lang = request.Lang ?? tool.Lang;
        tool.UpdateTime = DateTime.UtcNow;

        await databaseContext.SaveChangesAsync();

        return new StUpdateResult
        {
            Code = Codes.Ok,
            Message = "Tool updated successfully",
            Data = toolUid.ToString()
        };
    }

    [Route("/stargate/management/tools/{uid}")]
    [HttpDelete]
    public async Task<PLExceptionResult> DeleteTool([FromRoute] string uid)
    {
        if (!Guid.TryParse(uid, out var toolUid))
            return new PLExceptionResult { Code = Codes.Error, Message = "Invalid tool ID" };

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            return new PLExceptionResult { Code = Codes.Error, Message = "User not authenticated" };

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts
            .FirstOrDefaultAsync(o => o.Username == user.Identity.Name);

        if (account == null)
            return new PLExceptionResult { Code = Codes.Error, Message = "Account not found" };

        if (account.Uid != RootUserUid)
            return new PLExceptionResult { Code = Codes.Error, Message = "Permission denied: root user required" };

        var tool = await databaseContext.CommunityTools.FirstOrDefaultAsync(t => t.Uid == toolUid);
        if (tool == null)
            return new PLExceptionResult { Code = Codes.Error, Message = "Tool not found" };

        databaseContext.CommunityTools.Remove(tool);
        await databaseContext.SaveChangesAsync();

        return new PLExceptionResult { Code = Codes.Ok, Message = "Tool deleted successfully" };
    }

    private static MSelectResult<CmToolModel> ErrorSelectResult(string message)
    {
        return new MSelectResult<CmToolModel>
        {
            Code = Codes.Error,
            Message = message,
            Data = new MSelectData<CmToolModel>
                { Page = 1, Size = 10, Range = new List<CmToolModel>(), Count = 0 }
        };
    }
}