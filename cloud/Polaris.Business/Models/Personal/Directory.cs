

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Polaris.Business.Models.Personal
{
    [Table("directories", Schema = "personal")]
    [PrimaryKey(nameof(Pk))]
    public class DirectoryModel
    {
        [Column("pk", TypeName = "varchar(64)")]
        [JsonPropertyName("pk")]
        public string Pk { get; set; } = "";

        [Column("title", TypeName = "varchar(128)")]
        [JsonPropertyName("title")]
        public string Title { get; set; } = "";

        [Column("create_time", TypeName = "timestamptz")]
        [JsonPropertyName("create_time")]
        public DateTime CreateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

        [Column("update_time", TypeName = "timestamptz")]
        [JsonPropertyName("update_time")]
        public DateTime UpdateTime { get; set; } = new(2023, 1, 1, 0, 0, 0);

        [Column("owner", TypeName = "varchar(96)")]
        [JsonPropertyName("owner")]
        public string Owner { get; set; } = "";

        [Column("description", TypeName = "varchar(512)")]
        [JsonPropertyName("description")]
        public string Description { get; set; } = "";

        [Column("parent", TypeName = "varchar(96)")]
        [JsonPropertyName("parent")]
        public string Parent { get; set; } = "";

        [Column("level", TypeName = "integer")]
        [JsonPropertyName("level")]
        public int Level { get; set; } = 0;

        [Column("notebook", TypeName = "varchar(96)")]
        [JsonPropertyName("notebook")]
        public string Notebook { get; set; } = "";

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

        [Column("path", TypeName = "varchar(4096)")]
        [JsonPropertyName("path")]
        public string Path { get; set; } = "";

        [NotMapped]
        [JsonPropertyName("children")]
        public List<DirectoryModel> Children { get; set; } = new();

        // public static void MapperConfig(IMapperConfigurationExpression cfg)
        // {
        //     cfg.CreateMap<IDataReader, DirectoryModel>()
        //         .ForMember(a => a.CreateTime, opt => opt.MapFrom(src => src["create_time"]))
        //         .ForMember(a => a.UpdateTime, opt => opt.MapFrom(src => src["update_time"]))
        //         .ForMember(a => a.NotebookName, opt => opt.MapFrom(src => src["notebook_name"]))
        //         .ForMember(a => a.ProfileName, opt => opt.MapFrom(src => src["profile_name"]))
        //         .ForMember(a => a.Children, opt => opt.Ignore());
        // }
    }
}
