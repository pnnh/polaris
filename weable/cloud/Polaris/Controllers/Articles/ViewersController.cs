using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Polaris;

namespace Polaris.Controllers.Articles;

[ApiController]
[Authorize]
public class ViewersController(ILogger<ViewersController> logger, DatabaseContext configuration)
    : ControllerBase
{
    private readonly ILogger<ViewersController> _logger = logger;

    [Route("/polaris/channels/{channel}/articles/{article}/view")]
    [AllowAnonymous]
    [HttpPost]
    public async Task<PModifyResult> Insert([FromRoute] string channel, [FromRoute] string article)
    {
        var queryHelper = await JsonHelper.NewAsync(Request.Body);
        var clientIp = queryHelper.GetString("ip");

        if (string.IsNullOrEmpty(clientIp) || string.IsNullOrEmpty(channel) || string.IsNullOrEmpty(article)) {
            return new PModifyResult { Uid = Guid.Empty };
        }

        var channelUid = MIDHelper.Base58.GuidDecode(channel);
        var articleUid = MIDHelper.Base58.GuidDecode(article);

        if (channelUid == null || articleUid == null) {
            return new PModifyResult { Uid = Guid.Empty };
        }

        if (!IPAddress.TryParse(clientIp, out var clientAddress))
        {
            //throw new PLBizException("IP地址有误：" + clientIp);
            return new PModifyResult { Uid = Guid.Empty };
        }

        await using (var transaction = await configuration.Database.BeginTransactionAsync())
        {
            var viewer = configuration.Viewers.FirstOrDefault(m => m.Source == clientAddress
                                                                  && m.Target == articleUid && m.Direction == "uta");
            if (viewer != null)
            {
                if (viewer.UpdateTime.AddHours(24) > DateTime.UtcNow)
                    // 24小时内只能更新一次
                    return new PModifyResult { Uid = viewer.Uid };

                configuration.Attach(viewer);
                viewer.UpdateTime = DateTime.UtcNow;
                configuration.Entry(viewer).Property(p => p.UpdateTime).IsModified = true;
            }
            else
            {
                var model = new PSViewerModel
                {
                    Uid = Guid.NewGuid(),
                    Direction = "uta",
                    Source = clientAddress,
                    Target = articleUid.Value,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow,
                    Channel = channelUid.Value
                };
                configuration.Viewers.Add(model);
            }

            var articleView = configuration.PSArticles.FirstOrDefault(m => m.Uid == articleUid.Value);
            if (articleView == null)
            {
                throw new PLBizException("更新阅读数量出错");
            }

            configuration.Attach(articleView);
            articleView.Discover += 1;
            configuration.Entry(articleView).Property(p => p.Discover).IsModified = true;

            await configuration.SaveChangesAsync();

            await transaction.CommitAsync();
        }

        return new PModifyResult { Uid = Guid.Empty };
    }
}