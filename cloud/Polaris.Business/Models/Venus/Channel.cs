using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Molecule.Helpers;
using Molecule.Models;

namespace Polaris.Business.Models.Venus;

[Table("channels", Schema = "venus")]
[PrimaryKey(nameof(Uid))]
public class NSChannelModel
{
    [Column("uid", TypeName = "uuid")] public Guid Uid { get; set; }

    [NotMapped] public string Urn => MIDHelper.Base58.GuidEncode(Uid);

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
    public string Description { get; set; } = "";

    [Column("image", TypeName = "varchar(2048)")]
    public string Image { get; set; } = "";
}

public class NSChannelPicturesView
{
    public NSChannelModel Channel { get; set; } = new();
    public MSelectResult<NSPictureModel> Pictures { get; set; } = new();
}