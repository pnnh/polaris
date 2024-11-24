using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Polaris.Business.Models;

[Table("credentials")]
[PrimaryKey(nameof(Pk))]
public class CredentialTable
{
    [Column("pk", TypeName = "varchar(64)")]
    public string Pk { get; set; } = "";
    [Column("id", TypeName = "varchar(64)")]
    public string Id { get; set; } = "";
    [Column("type", TypeName = "int")]
    public int Type { get; set; } = 0;
    [Column("transports", TypeName = "varchar(96)")]
    public string Transports { get; set; } = "";
    [Column("user", TypeName = "varchar(64)")]
    public string User { get; set; } = "";
    [Column("public_key", TypeName = "varchar(256)")]
    public string PublicKey { get; set; } = "";
    [Column("user_handle", TypeName = "varchar(256)")]
    public string UserHandle { get; set; } = "";
    [Column("signature_counter", TypeName = "int")]
    public uint SignatureCounter { get; set; } = 0;
    [Column("cred_type", TypeName = "varchar(64)")]
    public string CredType { get; set; } = "";
    [Column("aa_guid", TypeName = "varchar(64)")]
    public string AaGuid { get; set; } = "";

    [Column("create_time", TypeName = "timestamptz")]
    public DateTime CreateTime { get; set; } = DateTime.MinValue;

    [Column("update_time", TypeName = "timestamptz")]
    public DateTime UpdateTime { get; set; } = DateTime.MinValue;
}
