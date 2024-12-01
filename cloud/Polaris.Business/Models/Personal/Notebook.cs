

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

    [Table("notebooks", Schema = "personal")]
    [PrimaryKey(nameof(Uid))]
    public class NotebookModel
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

        [Column("create_time", TypeName = "timestamptz")]
        [JsonPropertyName("create_time")]
        public DateTime CreateTime { get; set; } = DateTime.MinValue;

        [Column("update_time", TypeName = "timestamptz")]
        [JsonPropertyName("update_time")]
        public DateTime UpdateTime { get; set; } = DateTime.MinValue;

        [Column("owner", TypeName = "uuid")]
        [JsonPropertyName("owner")]
        public Guid Owner { get; set; } 

        [Column("description", TypeName = "varchar(512)")]
        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [Column("name", TypeName = "varchar(96)")]
        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [Column("image", TypeName = "varchar(2048)")]
        [JsonPropertyName("image")]
        public string Image { get; set; } = "";

        [Column("profile", TypeName = "varchar(96)")]
        [JsonPropertyName("profile")]
        public string Profile { get; set; } = "";

        public static void MapperConfig(IMapperConfigurationExpression cfg)
        {
            cfg.CreateMap<IDataReader, NotebookModel>()
                .ForMember(a => a.CreateTime, opt => opt.MapFrom(src => src["create_time"]))
                .ForMember(a => a.UpdateTime, opt => opt.MapFrom(src => src["update_time"]));
        }
    }
}
