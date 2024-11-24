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
public class NotebookContentController : ControllerBase
{
    private readonly DatabaseContext _dataContext;
    private readonly ILogger<NoteContentController> _logger;

    public NotebookContentController(ILogger<NoteContentController> logger, DatabaseContext configuration)
    {
        _logger = logger;
        _dataContext = configuration;
    }


    [Route("/console/libraries/{library}/notebooks")]
    [AllowAnonymous]
    [HttpGet]
    public MSelectResult<NotebookModel> Select([FromRoute]Guid library)
    {
        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*
from personal.notebooks as a
where library = @library
");
        parameters.Add("library", library);
        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<NotebookModel>(_dataContext, querySqlText, parameters);

        var models = modelsQuery.ToList();

        return new MSelectResult<NotebookModel>
        {
            Range = models,
            Count = models.Count
        };
    }
}