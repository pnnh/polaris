using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Polaris.Business.Models.Community;

[Table("tools", Schema = "community")]
[PrimaryKey(nameof(Uid))]
public class CmToolModel
{
    [Column("uid", TypeName = "uuid")] public Guid Uid { get; set; }

    [Column("title", TypeName = "varchar(128)")]
    public string Title { get; set; } = "";

    [Column("create_time", TypeName = "timestamptz")]
    [JsonPropertyName("create_time")]
    public DateTime CreateTime { get; set; } = DateTime.MinValue;

    [Column("update_time", TypeName = "timestamptz")]
    [JsonPropertyName("update_time")]
    public DateTime UpdateTime { get; set; } = DateTime.MinValue;

    [Column("keywords", TypeName = "varchar(128)")]
    public string? Keywords { get; set; } = "";

    [Column("description", TypeName = "varchar(512)")]
    public string? Description { get; set; } = "";

    [Column("status", TypeName = "integer")]
    public int Status { get; set; } = 0;

    [Column("cover", TypeName = "varchar(256)")]
    public string? Cover { get; set; } = "";

    [Column("owner", TypeName = "uuid")]
    public Guid? Owner { get; set; }

    [Column("discover", TypeName = "integer")]
    public int Discover { get; set; } = 0;

    [Column("version", TypeName = "varchar(64)")]
    public string? Version { get; set; }

    [Column("url", TypeName = "varchar(256)")]
    public string? Url { get; set; }

    [Column("lang", TypeName = "varchar(8)")]
    public string? Lang { get; set; }

    [Column("name", TypeName = "varchar(256)")]
    public string? Name { get; set; }
}
