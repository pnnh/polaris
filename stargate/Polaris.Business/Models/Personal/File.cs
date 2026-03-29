using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace Polaris.Business.Models.Personal;

[Table("files", Schema = "personal")]
[PrimaryKey(nameof(Uid))]
public class PsFileModel
{
    // 一个常量，表示根文件的 UID，可以在系统初始化时创建一个根文件夹
    public static Guid RootFileUid = Guid.Parse("76de121c-0fab-11f1-a643-6c02e0549f86");

    [Column("uid", TypeName = "uuid")]
    [JsonPropertyName("uid")]
    public Guid Uid { get; set; }

    [Column("name", TypeName = "varchar(256)")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [Column("title", TypeName = "varchar(128)")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = "";

    [Column("header", TypeName = "varchar(2048)")]
    public string Header { get; set; } = "";

    [Column("lang", TypeName = "varchar(32)")]
    public string? Lang { get; set; } = "";

    [Column("channel", TypeName = "uuid")] public Guid? Channel { get; set; }

    [Column("body", TypeName = "text")]
    [JsonPropertyName("body")]
    public string Body { get; set; } = "";

    [Column("create_time", TypeName = "timestamptz")]
    [JsonPropertyName("create_time")]
    public DateTime CreateTime { get; set; } = DateTime.MinValue;

    [Column("update_time", TypeName = "timestamptz")]
    [JsonPropertyName("update_time")]
    public DateTime UpdateTime { get; set; } = DateTime.MinValue;

    [Column("owner", TypeName = "uuid")] public Guid Owner { get; set; }

    [Column("keywords", TypeName = "varchar(128)")]
    [JsonPropertyName("keywords")]
    public string? Keywords { get; set; } = "";

    [Column("description", TypeName = "varchar(512)")]
    public string? Description { get; set; } = "";

    [Column("status", TypeName = "int")] public int Status { get; set; }

    [Column("cover", TypeName = "varchar(256)")]
    public string? Cover { get; set; } = "";

    [Column("discover", TypeName = "integer")]
    public int Discover { get; set; }

    [NotMapped]
    [JsonPropertyName("owner_name")]
    public string? OwnerName { get; set; } = "";


    [Column("url", TypeName = "varchar(2048)")]
    public string? Url { get; set; } = "";

    [Column("mimetype", TypeName = "varchar(512)")]
    public string? MimeType { get; set; } = "";

    [Column("parent", TypeName = "uuid")] public Guid? Parent { get; set; }


    [Column("path", TypeName = "varchar(8192)")]
    public string? Path { get; set; } = "";

    public static PsFileModel GetRootFile()
    {
        return new PsFileModel
        {
            Uid = RootFileUid,
            Title = "Root",
            Header = "{}",
            Body = "{}",
            CreateTime = DateTime.UtcNow,
            UpdateTime = DateTime.UtcNow,
            Owner = Guid.Empty,
            Keywords = "",
            Description = "",
            Status = 0,
            Cover = "",
            Discover = 0,
            OwnerName = "System",
            Url = "",
            MimeType = "",
            Parent = null,
            Path = RootFileUid.ToString()
        };
    }
}