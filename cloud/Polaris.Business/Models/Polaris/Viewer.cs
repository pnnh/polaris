using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Polaris.Business.Models.Polaris;

[Table("viewers", Schema = "polaris")]
[PrimaryKey(nameof(Uid))]
public class PSViewerModel
{
    [Column("uid", TypeName = "uuid")] public Guid Uid { get; set; }

    [Column("source", TypeName = "inet")] public IPAddress Source { get; set; } = IPAddress.None;

    [Column("owner", TypeName = "uuid")] public Guid Owner { get; set; }

    [Column("target", TypeName = "uuid")] public Guid Target { get; set; }

    [Column("channel", TypeName = "uuid")] public Guid Channel { get; set; }

    [Column("direction", TypeName = "varchar(16)")]
    public string Direction { get; set; } = "";

    [Column("create_time", TypeName = "timestamptz")]
    [JsonPropertyName("create_time")]
    public DateTime CreateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

    [Column("update_time", TypeName = "timestamptz")]
    [JsonPropertyName("update_time")]
    public DateTime UpdateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);
}