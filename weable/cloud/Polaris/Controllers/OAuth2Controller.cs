
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Molecule.Models;
using Molecule.Utils;
using Polaris.Business.Models;
using Polaris.Business.Services;

namespace Polaris.Controllers;

[ApiController]
public class OAuth2Controller(
    DatabaseContext databaseContext,
    IConfiguration configuration) : ControllerBase
{
    [Route("/oauth2/code")]
    public async Task<ActionResult> Code(string code, string state, string scope, string? error)
    {
        if (!string.IsNullOrEmpty(error))
        {
            throw new PLBizException($"认证失败: {error}");
        }
        //var stateDecode = Encoding.UTF8.GetString(Convert.FromBase64String(state));
        var authServer = configuration["AuthServer"];
        var selfUrl = configuration["SelfUrl"];
        if (string.IsNullOrEmpty(authServer) || string.IsNullOrEmpty(selfUrl))
            throw new PLBizException("AuthServer or SelfUrl is not configured");
        var tokenUrl = $"{authServer}/oauth2/token";
        
        var oauth2Client = configuration["OAuth2:ClientId"];
        var oauth2Secret = configuration["OAuth2:ClientSecret"];
        
        if (string.IsNullOrEmpty(oauth2Client) || string.IsNullOrEmpty(oauth2Secret))
            throw new PLBizException("OAuth2 Client or Secret is not configured");

        var tokenParameters = new Dictionary<string, string>
        {
            { "client_id", oauth2Client },
            { "client_secret", oauth2Secret },
            { "grant_type", "authorization_code" },
            { "code", code },
            { "redirect_uri", $"{selfUrl}/oauth2/code" }
        };

        var formContent = new FormUrlEncodedContent(tokenParameters.Select(x => new KeyValuePair<string, string>(x.Key, x.Value)));
        var tokenResult = await HttpHelper.PostAsync(tokenUrl, formContent);
        var tokenResultContent = await tokenResult.Content.ReadAsStringAsync();
        var tokenResultModel = JsonSerializer.Deserialize<OAuth2TokenResult>(tokenResultContent,
        new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
        });
        if (tokenResultModel == null || !string.IsNullOrEmpty(tokenResultModel.Error) || string.IsNullOrEmpty(tokenResultModel.AccessToken) ||
         string.IsNullOrEmpty(tokenResultModel.IdToken))
        {
            throw new PLBizException("认证失败");
        }
        var webUrl = configuration["WebUrl"];
        if (string.IsNullOrEmpty(webUrl))
        {
            throw new PLBizException("认证失败");
        }

        var oauth2User = await AccountService.IntrospectAccount(tokenResultModel.AccessToken,
            oauth2Client, oauth2Secret, authServer);
        if (oauth2User == null)
        {
            throw new PLBizException("认证失败");
        }

        var expireTime = DateTime.Now.AddSeconds(tokenResultModel.ExpiresIn);
        var accountModel = AccountService.SyncAccount(databaseContext, tokenResultModel.AccessToken, expireTime, oauth2User);
        if (accountModel.LoginSession == null)
        {
            throw new PLBizException("认证失败");
        }

        var jwtKey = configuration.GetSection("Jwt:Secret").Value;
        if (jwtKey == null || string.IsNullOrEmpty(jwtKey))
            throw new PLBizException("JwtKey is not configured");

        var authCookieValue = JwtHelper.GenerateToken(jwtKey, accountModel.Uid.ToString(), accountModel.Username,
        accountModel.LoginSession.ToString());

        Response.Cookies.Append(AccountService.AuthCookieName, authCookieValue, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            MaxAge = TimeSpan.FromSeconds(tokenResultModel.ExpiresIn)
        });

        return Redirect(webUrl);
    }
}

class OAuth2TokenResult
{
    public string? Error { get; set; } = "";
    public string AccessToken { get; set; } = "";
    public string TokenType { get; set; } = "";
    public int ExpiresIn { get; set; }
    public string RefreshToken { get; set; } = "";
    public string Scope { get; set; } = "";
    public string IdToken { get; set; } = "";
    public int CreatedAt { get; set; }
}