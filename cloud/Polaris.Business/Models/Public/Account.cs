using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Molecule.Helpers;

namespace Polaris.Business.Models.Public;

[Table("accounts", Schema = "public")]
[PrimaryKey(nameof(Uid))]
public class PBAccountModel
{
    [Column("uid", TypeName = "uuid")] public Guid Uid { get; set; }
    
    [JsonPropertyName("urn")]
    [NotMapped] public string Urn => MIDHelper.Base58.GuidEncode(Uid);

    [Column("create_time", TypeName = "timestamptz")]
    public DateTime CreateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

    [Column("update_time", TypeName = "timestamptz")]
    public DateTime UpdateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

    [Column("account", TypeName = "varchar(96)")]
    [JsonIgnore]
    public string Username { get; set; } = "";

    [Column("password", TypeName = "varchar(96)")]
    [JsonIgnore]
    public string Password { get; set; } = "";

    [Column("image", TypeName = "varchar(256)")]
    public string Image { get; set; } = "";

    [Column("description", TypeName = "varchar(256)")]
    public string Description { get; set; } = "";

    [Column("mail", TypeName = "varchar(128)")]
    public string Mail { get; set; } = "";
    
    [Column("role", TypeName = "varchar(128)")]
    public string Role { get; set; } = "";

    [Column("status", TypeName = "int")] public int Status { get; set; } = 0;

    [Column("nickname", TypeName = "varchar(64)")]
    public string Nickname { get; set; } = "";

    [Column("counter", TypeName = "int")] public uint Counter { get; set; } = 0;

    [Column("access_token", TypeName = "varchar(256)")]
    public string AccessToken { get; set; } = "";

    [Column("token_issuer", TypeName = "varchar(128)")]
    [JsonIgnore]
    public string TokenIssuer { get; set; } = "";

    [Column("token_expire", TypeName = "timestamptz")]
    [JsonIgnore]
    public DateTime TokenExpire { get; set; } = new(2023, 1, 1, 0, 0, 0);

    [Column("sync_time", TypeName = "timestamptz")]
    [JsonIgnore]
    public DateTime SyncTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

    [Column("login_session", TypeName = "varchar(256)")]
    [JsonIgnore]
    public string? LoginSession { get; set; } = "";
}