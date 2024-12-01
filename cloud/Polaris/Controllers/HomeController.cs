using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Molecule.Helpers;
using Molecule.Models;

namespace Polaris.Controllers;

[ApiController]
public class HomeController(ILogger<HomeController> logger) : ControllerBase
{
    [Route("/")]
    public string Index()
    {
        for(var i = 0; i<100;i++)
        {
            var name = MIDHelper.Base58.GuidEncode(Guid.NewGuid());
            logger.LogInformation($"=========={name}==={name.Length}");
        }
        return "Polaris业务接口服务";
    }
    
}