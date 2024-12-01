using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Text.Json.Serialization;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Molecule.Helpers;

namespace Polaris.Business.Models.Venus;

[Table("pictures", Schema = "venus")]
[PrimaryKey(nameof(Uid))]
public class NSPictureModel
{
    [Column("uid", TypeName = "uuid")]
    [JsonPropertyName("uid")]
    public Guid Uid { get; set; }

    [NotMapped] public string Urn => MIDHelper.Base58.GuidEncode(Uid);

    [Column("owner", TypeName = "uuid")]
    public Guid Owner { get; set; }

    [Column("title", TypeName = "varchar(128)")]
    public string Title { get; set; } = "";

    [Column("create_time", TypeName = "timestamptz")]
    public DateTime CreateTime { get; set; } = DateTime.MinValue;

    [Column("update_time", TypeName = "timestamptz")]
    public DateTime UpdateTime { get; set; } = DateTime.MinValue;

    [Column("description", TypeName = "varchar(512)")]
    public string Description { get; set; } = "";

    [Column("status", TypeName = "int")]
    public int Status { get; set; }

    [Column("file", TypeName = "varchar(1024)")]
    public string File { get; set; } = "";

    [Column("folder", TypeName = "varchar(1024)")] public string Folder { get; set; } = "";
}