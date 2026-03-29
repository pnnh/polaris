using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Polaris.Business.Models.Community;

[Table("channels", Schema = "community")]
[PrimaryKey(nameof(Uid))]
public class CmChannelModel
{
    [Column("uid", TypeName = "uuid")] public Guid Uid { get; set; }

    [Column("name", TypeName = "varchar(128)")]
    public string Name { get; set; } = "";

    [Column("create_time", TypeName = "timestamptz")]
    [JsonPropertyName("create_time")]
    public DateTime CreateTime { get; set; } = DateTime.MinValue;

    [Column("update_time", TypeName = "timestamptz")]
    [JsonPropertyName("update_time")]
    public DateTime UpdateTime { get; set; } = DateTime.MinValue;

    [Column("owner", TypeName = "uuid")] public Guid Owner { get; set; }

    [Column("description", TypeName = "varchar(256)")]
    public string? Description { get; set; } = "";

    [Column("image", TypeName = "varchar(2048)")]
    public string? Image { get; set; } = "";

    [Column("status", TypeName = "int")]
    public int Status { get; set; }

    [NotMapped]
    [JsonPropertyName("owner_name")]
    public string? OwnerName { get; set; }
}
//
// public class ChannelPostsView
// {
//     public PSChannelModel Channel { get; set; } = new();
//     public MSelectResult<PSArticleModel> Posts { get; set; } = new();
// }