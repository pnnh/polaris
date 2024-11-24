using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Text.Json;
using System.Text.Json.Serialization;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Polaris.Business.Models;

[Table("relations")]
[PrimaryKey(nameof(Uid))]
public class RelationModel
{
    [Column("uid", TypeName = "uuid")]
    [JsonPropertyName("uid")]
    public Guid Uid { get; set; }

    [Column("source", TypeName = "uuid")]
    [JsonPropertyName("source")]
    public Guid Source { get; set; }

    [Column("create_time", TypeName = "timestamptz")]
    [JsonPropertyName("create_time")]
    public DateTime CreateTime { get; set; } = DateTime.MinValue;

    [Column("update_time", TypeName = "timestamptz")]
    [JsonPropertyName("update_time")]
    public DateTime UpdateTime { get; set; } = DateTime.MinValue;

    [Column("owner", TypeName = "uuid")]
    [JsonPropertyName("creator")]
    public Guid Owner { get; set; }

    [Column("target", TypeName = "uuid")]
    [JsonPropertyName("target")]
    public Guid Target { get; set; }

    [Column("direction", TypeName = "varchar(16)")]
    [JsonPropertyName("direction")]
    public string Direction { get; set; } = "";

    [Column("discover", TypeName = "bigint")]
    [JsonPropertyName("discover")]
    public long Discover { get; set; }

    [Column("status", TypeName = "int")]
    [JsonPropertyName("status")]
    public int Status { get; set; }

    public static void MapperConfig(IMapperConfigurationExpression cfg)
    {
        cfg.CreateMap<IDataReader, RelationModel>()
            .ForMember(a => a.CreateTime, opt => opt.MapFrom(src => src["create_time"]))
            .ForMember(a => a.UpdateTime, opt => opt.MapFrom(src => src["update_time"]));
    }
}

public class
    CustomResolver<S, T, M> : IValueResolver<IDataReader, RelationFullModel<S, T>, M
    ?> // where S : BaseModel where T : BaseModel
{
    private readonly string _columnName = "";

    public CustomResolver(string columnName)
    {
        _columnName = columnName;
    }

    public M? Resolve(IDataReader source, RelationFullModel<S, T> destination, M? member, ResolutionContext context)
    {
        var value = source[_columnName];
        var stringValue = value?.ToString();
        if (string.IsNullOrEmpty(stringValue) || string.IsNullOrWhiteSpace(stringValue))
            return default;
        return JsonSerializer.Deserialize<M>(stringValue);
    }
}

public class
    RelationFullModel<S, T> : RelationModel //, IRelationFullModel<S, T> where S : BaseModel where T : BaseModel
{
    [Column("source_model")]
    [JsonPropertyName("source_model")]
    public S? SourceModel { get; set; }

    [Column("target_model")]
    [JsonPropertyName("target_model")]
    public T? TargetModel { get; set; }

    public new static void MapperConfig(IMapperConfigurationExpression cfg)
    {
        cfg.CreateMap<IDataReader, RelationFullModel<S, T>>()
            .ForMember(a => a.CreateTime, opt => opt.MapFrom(src => src["create_time"]))
            .ForMember(a => a.UpdateTime, opt => opt.MapFrom(src => src["update_time"]))
            .ForMember(a => a.SourceModel, opt => opt.MapFrom(new CustomResolver<S, T, S>("source_model")))
            .ForMember(a => a.TargetModel, opt => opt.MapFrom(new CustomResolver<S, T, T>("target_model")));
    }
}