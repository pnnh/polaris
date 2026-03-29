using System.Text;
using DaanV2.UUID;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Molecule.Helpers;
using Molecule.Models;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Community;
using Polaris.Business.Models.Personal;
using Polaris.Business.Models.Protocol;

namespace Polaris.Areas.Community.Controllers;

[Area("Community")]
[ApiController]
[Authorize]
public class FilesController(IDatabaseContextFactory databaseFactory, IConfiguration configuration) : ControllerBase
{
    [Route("/stargate/community/files")]
    [HttpGet]
    public async Task<MSelectResult<CmFileModel>> SelectFiles()
    {
        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            return new MSelectResult<CmFileModel>
            {
                Code = Codes.Error,
                Message = "User not authenticated",
                Data = new MSelectData<CmFileModel>
                {
                    Page = 1,
                    Size = 10,
                    Range = new List<CmFileModel>(),
                    Count = 0
                }
            };

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts.FirstOrDefaultAsync(o => o.Username == user.Identity.Name);
        if (account == null)
            return new MSelectResult<CmFileModel>
            {
                Code = Codes.Error,
                Message = "Account not found9",
                Data = new MSelectData<CmFileModel>
                {
                    Page = 1,
                    Size = 10,
                    Range = new List<CmFileModel>(),
                    Count = 0
                }
            };

        var queryHelper = new MQueryHelper(Request.Query);
        var keyword = queryHelper.GetString("keyword");
        var action = queryHelper.GetString("action");
        var sort = queryHelper.GetString("sort") ?? "latest";
        var filter = queryHelper.GetString("filter") ?? "all";
        var parent = queryHelper.GetString("parent") ?? "";

        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        if (action == "get" && !string.IsNullOrEmpty(keyword))
        {
            if (Guid.TryParse(keyword, out var fileUid))
            {
                var file = await databaseContext.CommunityFiles
                    .Where(a => a.Uid == fileUid && a.Owner == account.Uid)
                    .FirstOrDefaultAsync();

                if (file != null)
                    return new MSelectResult<CmFileModel>
                    {
                        Code = Codes.Ok,
                        Data = new MSelectData<CmFileModel>
                        {
                            Page = 1,
                            Size = 1,
                            Range = new List<CmFileModel> { file },
                            Count = 1
                        }
                    };
            }

            return new MSelectResult<CmFileModel>
            {
                Code = Codes.Error,
                Message = "File not found",
                Data = new MSelectData<CmFileModel>
                {
                    Page = 1,
                    Size = 0,
                    Range = new List<CmFileModel>(),
                    Count = 0
                }
            };
        }

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*, u.nickname as owner_name
from community.files as a
    left join public.accounts as u on a.owner = u.uid
where a.uid is not null and a.owner = @owner
");
        parameters.Add("@owner", account.Uid);

        if (keyword != null && !string.IsNullOrEmpty(keyword))
        {
            sqlBuilder.Append(@" and (a.title like @keyword or a.description like @keyword)");
            parameters.Add("@keyword", $@"%{keyword}%");
        }

        if (!string.IsNullOrEmpty(parent) && Guid.TryParse(parent, out var parentGuid))
        {
            sqlBuilder.Append(@" and a.parent = @parent ");
            parameters.Add("@parent", parentGuid);
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

        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(databaseContext, countSqlText, parameters);

        sqlBuilder.Append(sort == "read" ? @" order by a.discover desc" : @" order by a.update_time desc");

        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<CmFileModel>(databaseContext, querySqlText, parameters);

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
            Data = new MSelectData<CmFileModel>
            {
                Page = page,
                Size = size,
                Range = models,
                Count = totalCount ?? 0
            }
        };
    }

    [Route("/stargate/community/files/{uid}")]
    [HttpGet]
    public async Task<MGetResult<CmFileModel>> GetFile([FromRoute] string uid)
    {
        if (!Guid.TryParse(uid, out var fileUid))
            return new MGetResult<CmFileModel>
            {
                Code = Codes.Error,
                Message = "Invalid file ID",
                Data = new CmFileModel()
            };

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            return new MGetResult<CmFileModel>
            {
                Code = Codes.Error,
                Message = "User not authenticated",
                Data = new CmFileModel()
            };

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts.FirstOrDefaultAsync(o => o.Username == user.Identity.Name);
        if (account == null)
            return new MGetResult<CmFileModel>
            {
                Code = Codes.Error,
                Message = "Account not found10",
                Data = new CmFileModel()
            };

        var file = await databaseContext.CommunityFiles
            .Where(a => a.Uid == fileUid && a.Owner == account.Uid)
            .FirstOrDefaultAsync();

        if (file == null)
            return new MGetResult<CmFileModel>
            {
                Code = Codes.Error,
                Message = "File not found",
                Data = new CmFileModel()
            };

        var storageUrl = configuration["PUBLIC_STORAGE_URL"]
                         ?? throw new InvalidOperationException("PUBLIC_STORAGE_URL not found in First DB.");

        if (!string.IsNullOrEmpty(file.Url)) file.Url = file.Url.Replace("storage:/", storageUrl);

        return new MGetResult<CmFileModel>
        {
            Code = Codes.Ok,
            Data = file
        };
    }

    [Route("/stargate/community/files")]
    [HttpPost]
    public async Task<StInsertResult> InsertFile([FromBody] CmFileModel request)
    {
        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            throw new PLBizException("User not authenticated");

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts.FirstOrDefaultAsync(o => o.Username == user.Identity.Name);
        if (account == null) throw new PLBizException("Account not found");

        var now = DateTime.UtcNow;
        var fileUid = request.Uid == Guid.Empty ? MIDHelper.Default.NewUUIDv7().ToGuid() : request.Uid;

        var parentUid = request.Parent;
        PsFileModel? parentInfo = null;
        if (parentUid == PsFileModel.RootFileUid)
            parentInfo = PsFileModel.GetRootFile();
        else if (parentUid != null) parentInfo = databaseContext.CommunityFiles.FirstOrDefault(o => o.Uid == parentUid);
        if (parentInfo == null)
            throw new PLBizException("Parent file not found");

        var file = new CmFileModel
        {
            Uid = fileUid,
            Name = request.Name,
            Title = request.Title ?? "",
            Description = request.Description ?? "",
            Keywords = request.Keywords ?? "",
            Url = request.Url ?? "",
            MimeType = request.MimeType ?? "",
            Owner = account.Uid,
            Status = 0,
            Discover = 0,
            CreateTime = now,
            UpdateTime = now,
            Parent = parentInfo.Uid,
            Path = parentInfo.Path + "." + fileUid
        };

        await databaseContext.CommunityFiles.AddAsync(file);
        await databaseContext.SaveChangesAsync();

        return new StInsertResult
        {
            Code = Codes.Ok,
            Message = "File created successfully",
            Data = fileUid.ToString()
        };
    }

    [Route("/stargate/community/files/{uid}")]
    [HttpPut]
    [HttpPost]
    public async Task<StUpdateResult> UpdateFile([FromRoute] string uid, [FromBody] CmFileModel request)
    {
        if (!Guid.TryParse(uid, out var fileUid)) throw new PLBizException("Invalid file ID");

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
            throw new PLBizException("User not authenticated");

        await using var databaseContext = databaseFactory.CreateDbContext();
        var account = await databaseContext.Accounts.FirstOrDefaultAsync(o => o.Username == user.Identity.Name);
        if (account == null) throw new PLBizException("Account not found");

        var file = await databaseContext.CommunityFiles
            .Where(a => a.Uid == fileUid && a.Owner == account.Uid)
            .FirstOrDefaultAsync();

        if (file == null) throw new PLBizException("File not found or unauthorized");

        file.Title = request.Title ?? file.Title;
        file.Description = request.Description ?? file.Description;
        file.Keywords = request.Keywords ?? file.Keywords;
        file.Url = request.Url ?? file.Url;
        file.MimeType = request.MimeType ?? file.MimeType;
        file.UpdateTime = DateTime.UtcNow;

        await databaseContext.SaveChangesAsync();

        return new StUpdateResult
        {
            Code = Codes.Ok,
            Message = "File updated successfully",
            Data = fileUid.ToString()
        };
    }

    [Route("/stargate/community/files/{uid}")]
    [HttpDelete]
    public async Task<PLExceptionResult> DeleteFile([FromRoute] string uid)
    {
        if (!Guid.TryParse(uid, out var fileUid))
            return new PLExceptionResult
            {
                Code = Codes.Error,
                Message = "Invalid file ID"
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
                Message = "Account not found11"
            };

        var file = await databaseContext.CommunityFiles
            .Where(a => a.Uid == fileUid && a.Owner == account.Uid)
            .FirstOrDefaultAsync();

        if (file == null)
            return new PLExceptionResult
            {
                Code = Codes.Error,
                Message = "File not found or unauthorized"
            };

        databaseContext.CommunityFiles.Remove(file);
        await databaseContext.SaveChangesAsync();

        return new PLExceptionResult
        {
            Code = Codes.Ok,
            Message = "File deleted successfully"
        };
    }
}