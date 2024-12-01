using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc; 
using Molecule.Helpers;
using Molecule.Models;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Services; 
using Polaris.Business.Models.Venus;

namespace Polaris.Controllers.Venus;

[ApiController]
public class NSPicturesController(DatabaseContext configuration, ModelService modelService) : ControllerBase
{
    [Route("/pictures/{name}")]
    [HttpGet]
    [AllowAnonymous]
    public NSPictureModel? Get([FromRoute] string name)
    {
        var model = modelService.GetByKey<NSPictureModel>(name);
        return model;
    }

    [Route("/pictures")]
    [AllowAnonymous]
    [HttpGet]
    public MSelectResult<NSPictureModel> Select(string keyword = "", string sort = "latest", string filter = "all",
        int page = 1, int size = 10)
    {
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*
from venus.pictures as a
");
        sqlBuilder.Append(" where 1=1 ");
        if (!string.IsNullOrEmpty(keyword))
        {
            sqlBuilder.Append(@" and (a.title like @keyword or a.description like @keyword)");
            parameters.Add("@keyword", $@"%{keyword}%");
        }

        var countSqlText = $@"
select count(1) from ({sqlBuilder}) as temp;";

        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(configuration, countSqlText, parameters);

        sqlBuilder.Append(@" order by a.update_time desc");

        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<NSPictureModel>(configuration, querySqlText, parameters);

        var models = modelsQuery.ToList();

        return new MSelectResult<NSPictureModel>
        {
            Range = models,
            Count = totalCount ?? 0
        };
    }

    [Route("/pictures/{uid}")]
    [HttpDelete]
    public PModifyResult Delete([FromRoute] Guid uid)
    {
        var model = configuration.PSArticles.FirstOrDefault(m => m.Uid == uid);
        if (model == null) throw new PLBizException("文章不存在");
        configuration.PSArticles.Remove(model);
        var changes = configuration.SaveChanges();

        return new PModifyResult
        {
            Changes = changes
        };
    }

    [Route("/pictures")]
    [HttpPost]
    [HttpPut]
    public async Task<PModifyResult> Insert([FromRoute] NSPictureModel model)
    {
        model.UpdateTime = DateTime.Now;
        if (model.Uid == Guid.Empty)
        {
            model.Uid = MIDHelper.Default.NewUUIDv7();
            model.CreateTime = DateTime.Now;
            configuration.Pictures.Add(model);
            await configuration.SaveChangesAsync();
        }
        else
        {
            var entry = configuration.Entry(model);
            entry.Property(e => e.Title).IsModified = true;
            entry.Property(e => e.UpdateTime).IsModified = true;
            entry.Property(e => e.File).IsModified = true;
            await configuration.SaveChangesAsync();
        }

        return new PModifyResult { Uid = model.Uid };
    }

}