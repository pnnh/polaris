namespace Polaris.Business.Models;

using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

[Table("comments")]
[PrimaryKey(nameof(Pk))]
public class CommentModel
{
    [Column("pk", TypeName = "varchar(64)")]
    public string Pk { get; set; } = "";

    [Column("title", TypeName = "varchar(128)")]
    public string Title { get; set; } = "";
    
    [Column("content", TypeName = "text")]
    public string Content { get; set; } = "";

    [Column("create_time", TypeName = "timestamptz")]
    [JsonPropertyName("create_time")]
    public DateTime CreateTime { get; set; } = DateTime.MinValue;

    [Column("update_time", TypeName = "timestamptz")]
    [JsonPropertyName("update_time")]
    public DateTime UpdateTime { get; set; } = DateTime.MinValue;

    [Column("creator", TypeName = "varchar(64)")]
    public string Creator { get; set; } = "";
    
    [Column("receiver", TypeName = "varchar(64)")]
    public string Receiver { get; set; } = "";
}