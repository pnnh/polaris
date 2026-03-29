using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Molecule.Models;
using Newtonsoft.Json;
using Polaris.Business.Models.Public;

namespace Polaris.Business.Services;

public abstract class OAuth2AuthenticationDefaults
{
    public const string AuthenticationScheme = "OAuth2";
}

internal class OAuth2IntrospectResult
{
    public bool Active { get; set; } = false;

    [JsonProperty("client_id")] public string ClientId { get; set; } = "";

    [JsonProperty("username")] public string Username { get; set; } = "";

    public long Exp { get; set; }
    public long Iat { get; set; }
    public string? Iss { get; set; }
    public string? Sub { get; set; }
    public string? Aud { get; set; }
    public string? Scope { get; set; }
}

public class OAuth2AuthenticationClient : IIdentity
{
    public string? AuthenticationType { get; set; }
    public bool IsAuthenticated { get; set; }
    public string? Name { get; init; }
}

public class OAuth2AuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    IConfiguration configuration)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    private AuthenticateResult debugAuth(string? basicToken)
    {
        if (basicToken == null)
            return AuthenticateResult.Fail("Invalid Authorization Header");
        var decodedToken = Encoding.UTF8.GetString(Convert.FromBase64String(basicToken));
        var username = decodedToken.Split(":")[0];
        username = $"debug-{username ?? "anonymous"}";
        var client = new OAuth2AuthenticationClient
        {
            AuthenticationType = OAuth2AuthenticationDefaults.AuthenticationScheme,
            IsAuthenticated = true,
            Name = username
        };
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, username)
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(client, claims));

        return AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name));
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (Request.Cookies.TryGetValue(AccountService.PTAuthCookieName, out var authorizationHeader))
            return await ValidateAuth2(authorizationHeader);

        return AuthenticateResult.NoResult();
    }


    protected async Task<AuthenticateResult> ValidateAuth2(string authorizationHeader)
    {
        if (string.IsNullOrEmpty(authorizationHeader)) return AuthenticateResult.NoResult();

#if DEBUG
        if (authorizationHeader.StartsWith("Basic", StringComparison.OrdinalIgnoreCase))
        {
            var basicToken = authorizationHeader.Substring("Basic ".Length).Trim();
            return debugAuth(basicToken);
        }
#endif

        var accessToken = authorizationHeader.Trim();

        if (string.IsNullOrEmpty(accessToken)) return AuthenticateResult.Fail("Missing Authorization Header");

        var httpClient = new HttpClient();

        var authServer = configuration["INTERNAL_PORTAL_URL"]
                         ?? throw new InvalidOperationException("INTERNAL_PORTAL_URL not found in First DB.");

        if (string.IsNullOrEmpty(authServer))
            return AuthenticateResult.Fail("AuthServer is not configured");

        var queryParams = new Dictionary<string, string?>
        {
            ["token"] = accessToken
        };

        var uriString = QueryHelpers.AddQueryString($"{authServer}/account/auth/userinfo", queryParams);

        var request = new HttpRequestMessage(HttpMethod.Get, uriString);

        request.Headers.UserAgent.ParseAdd("stargate");

        var response = await httpClient.SendAsync(request);

        var responseValue = await response.Content.ReadAsStringAsync();
        var getResult = JsonConvert.DeserializeObject<MGetResult<DeAccountModel?>>(responseValue);
        if (getResult == null || getResult.Code != 200 || getResult.Data == null)
            return AuthenticateResult.Fail("token not active or client_id not match");

        var accountModel = getResult.Data;
        var username = accountModel.Username;
        var client = new OAuth2AuthenticationClient
        {
            AuthenticationType = OAuth2AuthenticationDefaults.AuthenticationScheme,
            IsAuthenticated = true,
            Name = username
        };
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, username)
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(client, claims));

        return AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name));
    }
}