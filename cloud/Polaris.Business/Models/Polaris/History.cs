
using Polaris.Business.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;
using AutoMapper;
using System.Data;

namespace Polaris.Business.Models.Polaris
{

    [Table("history", Schema = "polaris")]
    [PrimaryKey(nameof(Uid))]
    public class HistoryModel 
    {
        [Column("uid", TypeName = "uuid")]
        [JsonPropertyName("uid")]
        public Guid Uid { get; set; } = Guid.Empty;

        [Column("title", TypeName = "varchar(128)")]
        [JsonPropertyName("title")]
        public string Title { get; set; } = "";

        [Column("header", TypeName = "varchar(4096)")]
        [JsonPropertyName("header")]
        public string Header { get; set; } = "";

        [Column("body", TypeName = "text")]
        [JsonPropertyName("body")]
        public string Body { get; set; } = "";

        [Column("create_time", TypeName = "timestamptz")]
        [JsonPropertyName("create_time")]
        public DateTime CreateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

        [Column("update_time", TypeName = "timestamptz")]
        [JsonPropertyName("update_time")]
        public DateTime UpdateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

        [Column("creator", TypeName = "varchar(96)")]
        [JsonPropertyName("creator")]
        public string Creator { get; set; } = "";

        [Column("source", TypeName = "varchar(96)")]
        [JsonPropertyName("source")]
        public string Source { get; set; } = "";

        [Column("previous", TypeName = "varchar(96)")]
        [JsonPropertyName("previous")]
        public string Previous { get; set; } = "";

        [Column("version", TypeName = "int")]
        [JsonPropertyName("version")]
        public int Version { get; set; } = 1;

        public static void MapperConfig(IMapperConfigurationExpression cfg)
        {
            cfg.CreateMap<IDataReader, HistoryModel>()
                .ForMember(a => a.CreateTime, opt => opt.MapFrom(src => src["create_time"]))
                .ForMember(a => a.UpdateTime, opt => opt.MapFrom(src => src["update_time"]));
        }
    }
}
