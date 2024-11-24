
using System.Text.Json.Serialization;
using Polaris.Business.Models.Public;

namespace Polaris.Business.Models
{
    public class SessionModel {
        [JsonPropertyName("account")]
        public PBAccountModel Account { get; set; } = new();
        
        [JsonPropertyName("token")]
        public string Token { get; set; } = "";
        
        [JsonPropertyName("name")]
        public string Name { get; set; } = "";
        
        [JsonPropertyName("domain")]
        public string Domain { get; set; } = "";
    }
}
