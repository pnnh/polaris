using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers; 
using Polaris.Business.Models;
using Polaris.Business.Models.Polaris;
using Polaris.Business.Services;

namespace Polaris.Controllers.Articles;

[ApiController]
public class ArticleContentController(DatabaseContext configuration, ModelService modelService) : ControllerBase
{
    [Route("/channels/{channel}/articles/{article}")]
    [HttpGet]
    [AllowAnonymous]
    public PSArticleModel? Get([FromRoute] string article)
    {
        var model = modelService.GetByKey<PSArticleModel>(article);
        return model;
    }

    [Route("/posts")]
    [HttpPost]
    public async Task<PModifyResult> Insert()
    {
        var jsonHelper = await JsonHelper.NewAsync(Request.Body);
        var title = jsonHelper.GetString("title") ?? throw new PLBizException("title is required");
        var body = jsonHelper.GetString("body") ?? throw new PLBizException("body is required");

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name)) throw new PLBizException("用户未登录");
        var model = new PSArticleModel
        {
            Uid = MIDHelper.Default.NewUUIDv7(),
            Title = title,
            Body = body,
            Header = "markdown",
            CreateTime = DateTime.UtcNow,
            UpdateTime = DateTime.UtcNow,
            Owner = Guid.Empty
        };
        configuration.PSArticles.Add(model);
        configuration.SaveChanges();

        return new PModifyResult { Uid = model.Uid };
    }

    [Route("/posts/{uid}")]
    [HttpPut]
    public async Task<PModifyResult> Update([FromRoute] Guid uid)
    {
        var jsonHelper = await JsonHelper.NewAsync(Request.Body);
        var title = jsonHelper.GetString("title") ?? throw new PLBizException("title is required");
        var body = jsonHelper.GetString("body") ?? throw new PLBizException("body is required");

        var model = configuration.PSArticles.FirstOrDefault(m => m.Uid == uid);
        if (model == null) throw new PLBizException("文章不存在");

        model.Title = title;
        model.Body = body;
        var changes = configuration.SaveChanges();

        return new PModifyResult { Changes = changes };
    }
}