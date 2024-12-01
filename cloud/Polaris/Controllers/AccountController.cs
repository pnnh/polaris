using Microsoft.AspNetCore.Mvc;
using Polaris.Business.Models;
using Polaris.Business.Models.Public;

namespace Polaris.Controllers;

[ApiController]
public class AccountController(DatabaseContext databaseContext) : ControllerBase
{
    [Route("/account/session")]
    [HttpGet]
    public SessionModel? Session()
    {
        var claims = HttpContext.User;
        if (claims.Identity == null || string.IsNullOrEmpty(claims.Identity.Name))
        {
            return new SessionModel()
            {
                Account = new PBAccountModel()
                {
                    Uid = Guid.Empty,
                    Nickname = "Anonymous",
                    Username = "anonymous",
                    Role = "anonymous",
                },
                Name = "anonymous",
                Token = ""
            };
        }

        var account = databaseContext.Accounts.FirstOrDefault(o => o.LoginSession == claims.Identity.Name);
        if (account == null)
            return null;

        var session = new SessionModel
        {
            Account = account,
            Token = claims.Identity.Name
        };

        return session;
    }
    
    [Route("/account/information")]
    [HttpGet]
    public PBAccountModel? Information()
    {
        var claims = HttpContext.User;
        if (claims.Identity == null || string.IsNullOrEmpty(claims.Identity.Name))
        {
            return new PBAccountModel()
            {
                Uid = Guid.Empty,
                Nickname = "Anonymous",
                Username = "anonymous",
                Role = "anonymous",
            };
        }

        var account = databaseContext.Accounts.FirstOrDefault(o => o.LoginSession == claims.Identity.Name);
 
        return account;
    }
}