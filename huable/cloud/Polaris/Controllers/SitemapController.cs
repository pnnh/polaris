using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers;
using Polaris.Business.Models;
using X.Web.Sitemap;
using X.Web.Sitemap.Extensions;

namespace Polaris.Controllers;

public class SitemapController(DatabaseContext databaseContext,
    IConfiguration configuration) : ControllerBase
{
    [Route("/sitemap")]
    [HttpGet]
    [AllowAnonymous]
    public ActionResult Sitemap()
    {
        var lastArticles = databaseContext.PSArticles.
            OrderByDescending(o => o.UpdateTime).Take(256).ToList();

        var sitemap = new Sitemap();
        
        var webUrl = configuration.GetSection("WebUrl").Value;
        if (string.IsNullOrEmpty(webUrl)) throw new PLBizException("WebUrl is not configured");

        sitemap.Add(new Url
        {
            ChangeFrequency = ChangeFrequency.Monthly,
            Location = webUrl,
            Priority = 0.5,
            TimeStamp = DateTime.Now.Date
        });

        foreach (var article in lastArticles)
        {
            if (article.Channel == null) continue;
            var channelUrn = MIDHelper.Base58.GuidEncode(article.Channel.Value);
            sitemap.Add(new Url
            {
                ChangeFrequency = ChangeFrequency.Monthly,
                Location = $"{webUrl}/polaris/channels/{channelUrn}/articles/{article.Urn}",
                Priority = 0.5,
                TimeStamp = article.UpdateTime
            });
        }
        var xmlContent = sitemap.ToXml();
         
        return Content(xmlContent, "application/xml");
    }
}