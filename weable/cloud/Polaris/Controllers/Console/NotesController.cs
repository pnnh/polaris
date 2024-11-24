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
public class NoteContentController : ControllerBase
{
    private readonly ILogger<NoteContentController> _logger;
    private readonly DatabaseContext _dataContext;

    public NoteContentController(ILogger<NoteContentController> logger, DatabaseContext configuration)
    {
        this._logger = logger;
        this._dataContext = configuration;
    }


    [Route("/console/notebook/{notebook}/notes")]
    [AllowAnonymous]
    [HttpGet]
    public MSelectResult<NoteModel> Select([FromRoute]Guid notebook)
    {
        var queryHelper = new MQueryHelper(Request.Query);  
        var keyword = queryHelper.GetString("keyword");

        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*
from personal.notes as a
where a.notebook = @notebook and a.parent is null
");
        parameters.Add("@notebook", notebook);
        
        if (keyword != null && !string.IsNullOrEmpty(keyword))
        {
            sqlBuilder.Append(@" and (a.title like @keyword or a.description like @keyword)");
            parameters.Add("@keyword", $@"%{keyword}%");
        }

        var countSqlText = $@"
select count(1) from ({sqlBuilder}) as temp;";

        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(_dataContext, countSqlText, parameters);

        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<NoteModel>(_dataContext, querySqlText, parameters);

        var models = modelsQuery.ToList();

        return new MSelectResult<NoteModel>
        {
            Range = models,
            Count = totalCount ?? 0,
        };
    }

    [Route("/console/notes/{parent}/notes")]
    [AllowAnonymous]
    [HttpGet]
    public MSelectResult<NoteModel> SelectSubNotes([FromRoute] Guid parent)
    {
        var queryHelper = new MQueryHelper(Request.Query);

        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 100;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*
from personal.notes as a
where a.parent = @parent
");
        parameters.Add("@parent", parent);

        var countSqlText = $@"
select count(1) from ({sqlBuilder}) as temp;";

        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(_dataContext, countSqlText, parameters);

        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<NoteModel>(_dataContext, querySqlText, parameters);

        var models = modelsQuery.ToList();

        return new MSelectResult<NoteModel>
        {
            Range = models,
            Count = totalCount ?? 0,
        };
    }


    [Route("/console/notes/{uid}")]
    [HttpGet]
    [AllowAnonymous]
    public NoteModel Get([FromRoute]Guid uid)
    {
        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.* 
from personal.notes as a 
where a.uid = @uid
");
        parameters.Add("@uid", uid);
        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<NoteModel>(_dataContext, querySqlText, parameters);

        var model = modelsQuery.FirstOrDefault();
        if (model == null)
        {
            throw new PLBizException("Data not found.");
        }

        return model;
    }
}