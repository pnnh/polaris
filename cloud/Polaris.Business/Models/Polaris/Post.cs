using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Text.Json.Serialization;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Molecule.Helpers;

namespace Polaris.Business.Models.Polaris;

[Table("articles", Schema = "polaris")]
[PrimaryKey(nameof(Uid))]
public class PSArticleModel
{
    [Column("uid", TypeName = "uuid")]
    [JsonPropertyName("uid")]
    public Guid Uid { get; set; }

    [NotMapped] public string Urn => MIDHelper.Base58.GuidEncode(Uid);

    [Column("title", TypeName = "varchar(128)")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = "";

    [Column("header", TypeName = "varchar(64)")]
    public string Header { get; set; } = "";

    [Column("body", TypeName = "text")]
    [JsonPropertyName("body")]
    public string Body { get; set; } = "";

    [Column("create_time", TypeName = "timestamptz")]
    [JsonPropertyName("create_time")]
    public DateTime CreateTime { get; set; } = DateTime.MinValue;

    [Column("update_time", TypeName = "timestamptz")]
    [JsonPropertyName("update_time")]
    public DateTime UpdateTime { get; set; } = DateTime.MinValue;

    [Column("owner", TypeName = "uuid")]
    public Guid Owner { get; set; }

    [Column("keywords", TypeName = "varchar(128)")]
    [JsonPropertyName("keywords")]
    public string? Keywords { get; set; } = "";

    [Column("description", TypeName = "varchar(512)")]
    public string? Description { get; set; } = "";

    [Column("status", TypeName = "int")]
    public int Status { get; set; }

    [Column("cover", TypeName = "varchar(256)")]
    public string? Cover { get; set; } = "";

    [Column("discover", TypeName = "integer")]
    public int Discover { get; set; }

    [Column("channel", TypeName = "uuid")]
    public Guid? Channel { get; set; }
    
    [NotMapped]
    [JsonPropertyName("channel_urn")]
    public string ChannelUrn => MIDHelper.Base58.GuidEncode(Channel ?? Guid.Empty);

    [NotMapped]
    [JsonPropertyName("channel_name")]
    public string? ChannelName { get; set; } = "";
    
    [NotMapped]
    [JsonPropertyName("owner_name")]
    public string? OwnerName { get; set; } = "";

    [Column("partition", TypeName = "uuid")]
    public Guid? Partition { get; set; }
}