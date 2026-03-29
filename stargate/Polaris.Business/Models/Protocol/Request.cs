using System.Text.Json.Serialization;

namespace Polaris.Business.Models.Protocol;

/// <summary>
///     Request body for batch approval endpoint.
/// </summary>
public class MgApproveRequest
{
    [JsonPropertyName("uids")] public List<Guid> Uids { get; set; } = new();

    /// <summary>
    ///     Target status: 1 = Approved, 0 = Pending (reset)
    /// </summary>
    [JsonPropertyName("status")]
    public int Status { get; set; } = 1;
}