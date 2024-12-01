 using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers;
using Molecule.Models; 
using Polaris.Business.Models;
using Polaris.Business.Models.Polaris; 

namespace Polaris.Controllers.Articles.Admin;

[ApiController]
[Authorize]
public class PSChannelAdminController(DatabaseContext configuration)
    : ControllerBase
{
    [Route("/polaris/admin/channels")]
    [HttpGet]
    [AllowAnonymous]
    public MSelectResult<PSChannelModel> Select()
    {
        var queryHelper = new MQueryHelper(Request.Query);
        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);
        var models = configuration.Channels.OrderByDescending(o => o.UpdateTime).Skip(offset).Take(limit).ToList();
        var totalCount = configuration.Channels.Count();

        return new MSelectResult<PSChannelModel>
        {
            Range = models,
            Count = totalCount
        };
    }
}