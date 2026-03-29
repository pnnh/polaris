using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Molecule.Helpers;

namespace Polaris.Business.Models.Public;

[Table("accounts")]
[PrimaryKey(nameof(Uid))]
public class DeAccountModel
{
    [Column("uid", TypeName = "uuid")]
    [JsonPropertyName("uid")]
    public Guid Uid { get; set; }

    [Column("create_time", TypeName = "timestamptz")]
    public DateTime CreateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

    [Column("update_time", TypeName = "timestamptz")]
    public DateTime UpdateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

    [Column("username", TypeName = "varchar(96)")]
    [JsonPropertyName("username")]
    public string Username { get; set; } = "";

    [Column("password", TypeName = "varchar(96)")]
    [JsonIgnore]
    public string Password { get; set; } = "";

    [Column("photo", TypeName = "varchar(256)")]
    public string Photo { get; set; } = "";

    [Column("description", TypeName = "varchar(256)")]
    public string Description { get; set; } = "";

    [Column("email", TypeName = "varchar(128)")]
    [JsonPropertyName("email")]
    public string EMail { get; set; } = "";
     
    [Column("status", TypeName = "int")] public int Status { get; set; } = 0;

    [Column("nickname", TypeName = "varchar(64)")]
    public string? Nickname { get; set; } = "";
    
    [Column("website", TypeName = "varchar(512)")]
    public string? Website { get; set; } = "";
    
    [Column("session", TypeName = "varchar(512)")]
    [JsonIgnore]
    public string? Session { get; set; } = "";
}