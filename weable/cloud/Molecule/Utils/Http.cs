
using System;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Molecule.Utils;

public class HttpUtils
{
    public static bool IsBot(string userAgent)
    {
        userAgent = userAgent.ToLower();
        return userAgent.Contains("bot") || userAgent.Contains("spider");
    }
    
    [Obsolete("Use GetClientAddressFromDictionary(IDictionary<string, StringValues> dictionary) instead")]
    public static string? GetClientAddress(HttpContext httpContext)
    {
        var clientIp = GetClientAddressFromDictionary(httpContext.Request.Headers);
        
        if (String.IsNullOrEmpty(clientIp))
        {

            var remoteAddress = httpContext.Connection.RemoteIpAddress;
            clientIp = remoteAddress?.ToString();
        }

        return clientIp;
    }

    public static string? GetClientAddressFromDictionary(IDictionary<string, StringValues> dictionary)
    {
        if (dictionary.TryGetValue("X-Forwarded-For", out var forwardedValues))
        {
            return forwardedValues.FirstOrDefault(""); 
        }

        return dictionary.TryGetValue("REMOTE_ADDR", out var remoteAddrValues) ? remoteAddrValues.FirstOrDefault("") : null;
    }
    
}