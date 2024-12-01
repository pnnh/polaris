

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;
using AutoMapper;
using System.Data;

namespace Polaris.Business.Models.Personal
{

    [Table("notes", Schema = "personal")]
    [PrimaryKey(nameof(Uid))]
    public class NoteModel
    {
        [Column("uid", TypeName = "uuid")]
        [JsonPropertyName("uid")]
        public Guid Uid { get; set; }

        [Column("nid", TypeName = "bigint")]
        [JsonPropertyName("nid")]
        public long Nid { get; set; }

        [Column("title", TypeName = "varchar(128)")]
        [JsonPropertyName("title")]
        public string Title { get; set; } = "";

        [Column("header", TypeName = "varchar(64)")]
        [JsonPropertyName("header")]
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
        [JsonPropertyName("owner")]
        public Guid Owner { get; set; }

        [Column("keywords", TypeName = "varchar(128)")]
        [JsonPropertyName("keywords")]
        public string Keywords { get; set; } = "";

        [Column("description", TypeName = "varchar(512)")]
        [JsonPropertyName("description")]
        public string Description { get; set; } = "";

        [Column("status", TypeName = "int")]
        [JsonPropertyName("status")]
        public int Status { get; set; } = 0;

        [Column("cover", TypeName = "varchar(256)")]
        [JsonPropertyName("cover")]
        public string Cover { get; set; } = "";

        [Column("discover", TypeName = "integer")]
        [JsonPropertyName("discover")]
        public int Discover { get; set; } = 0;

        [Column("children", TypeName = "integer")]
        [JsonPropertyName("children")]
        public int Children { get; set; } = 0;

        [Column("notebook", TypeName = "uuid")]
        [JsonPropertyName("notebook")]
        public Guid Notebook { get; set; }

        [NotMapped]
        [JsonPropertyName("notebook_name")]
        public string NotebookName { get; set; } = "";

        [Column("name", TypeName = "varchar(96)")]
        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [Column("profile", TypeName = "varchar(96)")]
        [JsonPropertyName("profile")]
        public string Profile { get; set; } = "";

        [NotMapped]
        [JsonPropertyName("profile_name")]
        public string ProfileName { get; set; } = "";

        [Column("directory", TypeName = "varchar(96)")]
        [JsonPropertyName("directory")]
        public string Directory { get; set; } = "";

        [NotMapped]
        [JsonPropertyName("path")]
        public string Path { get; set; } = "";

        public static void MapperConfig(IMapperConfigurationExpression cfg)
        {
            cfg.CreateMap<IDataReader, NoteModel>()
                .ForMember(a => a.CreateTime, opt => opt.MapFrom(src => src["create_time"]))
                .ForMember(a => a.UpdateTime, opt => opt.MapFrom(src => src["update_time"]))
                .ForMember(a => a.NotebookName, opt => opt.MapFrom(src => src["notebook_name"]))
                .ForMember(a => a.ProfileName, opt => opt.MapFrom(src => src["profile_name"]))
                .ForMember(a => a.Path, opt => opt.MapFrom(src => src["path"]));
        }
    }
}
