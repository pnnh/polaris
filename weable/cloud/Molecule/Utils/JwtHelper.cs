using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Molecule.Utils;

public class JwtHelper
{
    public static string GenerateToken(string secretKey, string identifier,
        string username, string loginSession, int expireMinutes = 24 * 60)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, username),
            new(ClaimTypes.Role, "user"),
            new(JwtRegisteredClaimNames.UniqueName, username),
            new(JwtRegisteredClaimNames.Sub, username),
            new(JwtRegisteredClaimNames.Jti, loginSession),
            new(ClaimTypes.NameIdentifier, identifier)
        };
        var token = new JwtSecurityToken(
            "Polaris",
            "Polaris",
            claims,
            expires: DateTime.UtcNow.AddMinutes(expireMinutes),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static ClaimsPrincipal ValidateToken(string secretKey, string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secretKey);
        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        }, out var validatedToken);
        var jwtToken = (JwtSecurityToken)validatedToken;
        // var username = jwtToken.Claims.First(x => x.Type == "sub").Value;
        // var claims = new List<Claim> {
        //     new Claim(JwtRegisteredClaimNames.Sub, username),
        //     new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        // };
        var identity = new ClaimsIdentity(jwtToken.Claims);
        return new ClaimsPrincipal(identity);
    }
}