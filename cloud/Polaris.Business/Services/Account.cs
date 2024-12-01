using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Molecule.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Polaris;
using Polaris.Business.Models.Public;

namespace Polaris.Business.Services;

public class AccountService
{
    public const string AuthCookieName = "Polaris-Authorization";

    private static readonly object accountLock = new();


    public static PBAccountModel SyncAccount(DatabaseContext databaseContext, string accessToken, DateTime tokenExpire,
        OAuth2User tokenModel)
    {
        lock (accountLock)
        {

            var account = databaseContext.Accounts.FirstOrDefault(o => o.Username == tokenModel.Username);
            if (account == null)
            {
                account = new PBAccountModel
                {
                    Uid = MIDHelper.Default.NewUUIDv7(),
                    AccessToken = accessToken,
                    CreateTime = DateTime.Now,
                    UpdateTime = DateTime.Now,
                    Username = tokenModel.Username,
                    Description = "",
                    Mail = "",
                    Nickname = tokenModel.Username,
                    Status = 0,
                    TokenExpire = tokenExpire,
                    TokenIssuer = tokenModel.Issuer ?? "",
                    LoginSession = Guid.NewGuid().ToString()
                };
                databaseContext.Add(account);
                databaseContext.SaveChanges();
            }
            else
            {
                account.AccessToken = accessToken;
                account.TokenExpire = tokenExpire;
                account.TokenIssuer = tokenModel.Issuer ?? "";
                account.UpdateTime = DateTime.Now;
                account.LoginSession = Guid.NewGuid().ToString();
                databaseContext.Update(account);
                databaseContext.SaveChanges();
            }

            return account;
        }
    }

    public static async Task<OAuth2User?> IntrospectAccount(string accessToken, string clientId, string clientSecret, string authServer)
    {
        var parameters = new Dictionary<string, string> { { "token", accessToken } };
        var httpClient = new HttpClient();
 
        var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
  
        var response = await httpClient.PostAsync($"{authServer}/oauth2/introspect",
            new FormUrlEncodedContent(parameters));

        var responseValue = await response.Content.ReadAsStringAsync();
        var tokenModel = JsonSerializer.Deserialize<OAuth2IntrospectResult>(responseValue,
        new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
        });
        if (tokenModel == null || !tokenModel.Active ||
            tokenModel.ClientId != clientId)
            return null;

        var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        var expireTime = dtDateTime.AddSeconds(tokenModel.Exp).ToLocalTime();
        if (expireTime < DateTime.Now)
            return null;

        var oauth2User = new OAuth2User
        {
            Identifier = tokenModel.Sub ?? "",
            Nickname = tokenModel.Username,
            Username = tokenModel.Username,
            Issuer = tokenModel.Iss ?? ""
        };
        return oauth2User;
    }
}
