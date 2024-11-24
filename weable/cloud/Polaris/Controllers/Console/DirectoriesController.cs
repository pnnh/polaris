using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using Polaris.Business.Models;
using Polaris.Business.Models.Personal;
using Polaris.Business.Helpers;
using Molecule.Helpers;
using Polaris.Business.Services;
using Molecule.Models;

namespace Polaris.Controllers.Console;

[ApiController]
public class DirectoryContentController : ControllerBase
{
    private readonly ILogger<DirectoryContentController> _logger;
    private readonly DatabaseContext _dataContext;

    public DirectoryContentController(ILogger<DirectoryContentController> logger, DatabaseContext configuration)
    {
        this._logger = logger;
        this._dataContext = configuration;
    }


    [Route("/server/console/directories")]
    [AllowAnonymous]
    [HttpGet]
    public MSelectResult<DirectoryModel> Select()
    {
        var queryHelper = new MQueryHelper(Request.Query);
        var notebook = queryHelper.GetString("notebook");
        if (string.IsNullOrEmpty(notebook))
        {
            throw PLBizException.BadRequest("notebook");
        }

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*, c.name as notebook_name, p.username as profile_name
from personal.directories as a
    join personal.notebooks as c on c.pk = a.notebook
    join personal.profiles as p on p.pk = a.profile
where a.pk is not null
");
        sqlBuilder.Append(@" and a.notebook = @notebook");
        parameters.Add("@notebook", notebook);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<DirectoryModel>(_dataContext, querySqlText, parameters);

        var models = modelsQuery.ToList();

        var directoryService = new DirectoryService(new ServiceContext(_dataContext));
        var directoryTree = directoryService.RenderDirectoryTree(models, null);

        return new MSelectResult<DirectoryModel>
        {
            Range = directoryTree,
            Count = models.Count,
        };
    }
}