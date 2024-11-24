using Microsoft.Extensions.Primitives;

namespace Molecule.Tests;

using Molecule.Utils;

[TestClass]
public class TestHttpUtils
{
    [TestMethod]
    public void TestIsBot()
    {
        var isBot = HttpUtils.IsBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
        Assert.IsTrue(isBot, "Googlebot is a bot");
        var notBot = HttpUtils.IsBot("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        Assert.IsFalse(notBot, "Chrome is not a bot");
    }

    [TestMethod]
    public void TestGetClientAddressFromDictionary()
    {
        var forwardedDictionary = new Dictionary<string, StringValues>
        {
            { "X-Forwarded-For", "127.0.0.1" }, 
        };
        var clientIp = HttpUtils.GetClientAddressFromDictionary(forwardedDictionary);
        Assert.AreEqual("127.0.0.1", clientIp);
        var remoteDictionary = new Dictionary<string, StringValues>
        { 
            { "REMOTE_ADDR", "127.0.0.1" }
        };
        var remoteClientIp = HttpUtils.GetClientAddressFromDictionary(remoteDictionary);
        Assert.AreEqual("127.0.0.1", remoteClientIp);
        var emptyDictionary = new Dictionary<string, StringValues>();
        var emptyClientIp = HttpUtils.GetClientAddressFromDictionary(emptyDictionary);
        Assert.IsNull(emptyClientIp, "Empty dictionary should return null");
    }
}