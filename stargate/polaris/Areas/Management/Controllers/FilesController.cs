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
public class FilesController(IDatabaseContextFactory databaseFactory) : ControllerBase
{
    private static readonly Guid RootUserUid = Guid.Parse("a75a0ada-16c4-11f1-987b-42a82e58ed77");

    [Route("/stargate/management/files")]
    [HttpGet]
    public async Task<MSelectResult<CmFileModel>> SelectFiles()
    {
        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            return ErrorSelectResult("User not authenticated");

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts
            .FirstOrDefaultAsync(o => o.Username == user.Identity.Name);

        if (account == null) return ErrorSelectResult("Account not found");
        if (account.Uid != RootUserUid) return ErrorSelectResult("Permission denied: root user required");

        var queryHelper = new MQueryHelper(Request.Query);
        var keyword = queryHelper.GetString("keyword");
        var statusFilter = queryHelper.GetString("status");
        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select f.*, a.nickname as owner_name
from community.files as f
left join public.accounts as a on f.owner = a.uid
where f.uid is not null
");

        if (!string.IsNullOrEmpty(keyword))
        {
            sqlBuilder.Append(@" and (f.title like @keyword or f.name like @keyword or f.description like @keyword)");
            parameters.Add("@keyword", $@"%{keyword}%");
        }

        if (statusFilter == "pending")
            sqlBuilder.Append(@" and f.status = 0");
        else if (statusFilter == "approved")
            sqlBuilder.Append(@" and f.status = 1");

        var countSql = $@"select count(1) from ({sqlBuilder}) as temp;";
        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(databaseContext, countSql, parameters);

        sqlBuilder.Append(@" order by f.update_time desc limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var models = DatabaseContextHelper
            .RawSqlQuery<CmFileModel>(databaseContext, sqlBuilder.ToString(), parameters)
            .ToList();

        return new MSelectResult<CmFileModel>
        {
            Code = Codes.Ok,
            Data = new MSelectData<CmFileModel> { Page = page, Size = size, Range = models, Count = totalCount ?? 0 }
        };
    }

    [Route("/stargate/management/files/approve")]
    [HttpPost]
    public async Task<StInsertResult> ApproveFiles([FromBody] MgApproveRequest request)
    {
        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            throw new PLBizException("User not authenticated");

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts
            .FirstOrDefaultAsync(o => o.Username == user.Identity.Name);

        if (account == null) throw new PLBizException("Account not found");
        if (account.Uid != RootUserUid) throw new PLBizException("Permission denied: root user required");

        if (request.Uids == null || request.Uids.Count == 0)
            return new StInsertResult { Code = Codes.Ok, Message = "No files selected", Data = "0" };

        if (request.Status != 0 && request.Status != 1)
            throw new PLBizException("Invalid status value. Must be 0 or 1.");

        var files = await databaseContext.CommunityFiles
            .Where(f => request.Uids.Contains(f.Uid))
            .ToListAsync();

        foreach (var file in files)
        {
            file.Status = request.Status;
            file.UpdateTime = DateTime.UtcNow;
        }

        await databaseContext.SaveChangesAsync();

        return new StInsertResult
        {
            Code = Codes.Ok,
            Message = $"Updated status for {files.Count} files",
            Data = files.Count.ToString()
        };
    }

    private static MSelectResult<CmFileModel> ErrorSelectResult(string message)
    {
        return new MSelectResult<CmFileModel>
        {
            Code = Codes.Error, Message = message,
            Data = new MSelectData<CmFileModel> { Page = 1, Size = 10, Range = new List<CmFileModel>(), Count = 0 }
        };
    }
}