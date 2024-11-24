using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers;
using Molecule.Models;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Personal;

namespace Polaris.Controllers.Console;

[ApiController]
public class LibraryContentController : ControllerBase
{
    private readonly DatabaseContext _dataContext;
    private readonly ILogger<NoteContentController> _logger;

    public LibraryContentController(ILogger<NoteContentController> logger, DatabaseContext configuration)
    {
        _logger = logger;
        _dataContext = configuration;
    }


    [Route("/console/accounts/{uid}/libraries")]
    [AllowAnonymous]
    [HttpGet]
    public MSelectResult<LibraryModel> Select([FromRoute] Guid uid)
    {
        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*
from personal.libraries as a
where owner = @uid
");
        parameters.Add("uid", uid);
        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<LibraryModel>(_dataContext, querySqlText, parameters);

        var models = modelsQuery.ToList();

        return new MSelectResult<LibraryModel>
        {
            Range = models,
            Count = models.Count
        };
    }
}