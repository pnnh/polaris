新建一个 Stargate API 控制器。

用法：`/new-controller Area/ModuleName`

根据所属模块，在对应区域目录下创建控制器：

- **Community** → `polaris/Areas/Community/Controllers/`
- **Personal** → `polaris/Areas/Personal/Controllers/`
- **Management** → `polaris/Areas/Management/Controllers/`

控制器模板：
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Services;

namespace Polaris.Areas.Community.Controllers;

[Area("Community")]
[Route("stargate/community/[controller]")]
[ApiController]
[Authorize]
public class ItemsController : ControllerBase
{
    private readonly IDatabaseContextFactory _databaseContextFactory;
    private readonly ILogger<ItemsController> _logger;

    public ItemsController(IDatabaseContextFactory databaseContextFactory,
        ILogger<ItemsController> logger)
    {
        _databaseContextFactory = databaseContextFactory;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var account = await AccountService.GetCurrentAccount(HttpContext, _databaseContextFactory);
        if (account == null) return Unauthorized();

        // 简单 ORM 查询
        await using var databaseContext = _databaseContextFactory.Create();
        var items = await databaseContext.Items
            .Where(o => o.Owner == account.Uid)
            .ToListAsync();

        return Ok(PLResult<List<ItemModel>>.Ok(items));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateItemRequest request)
    {
        var account = await AccountService.GetCurrentAccount(HttpContext, _databaseContextFactory);
        if (account == null) return Unauthorized();

        await using var databaseContext = _databaseContextFactory.Create();
        var item = new ItemModel { Uid = Guid.NewGuid(), Owner = account.Uid };
        await databaseContext.Items.AddAsync(item);
        await databaseContext.SaveChangesAsync();

        return Ok(PLResult<string>.Ok(item.Uid.ToString(), "Created successfully"));
    }
}
```

**注意事项**：
- JSON 响应字段名自动转为 snake_case（`PropertyNamingPolicy.SnakeCaseLower`）
- 复杂 SQL 查询使用 `DatabaseContextHelper.RawSqlQuery<T>()`
- 日期时间统一存储为 UTC（`DateTime.UtcNow`）
- 在 `Polaris.Business/Models/DatabaseContext.cs` 中添加新的 `DbSet<T>`
