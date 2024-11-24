
using System.Text.Json.Serialization;

namespace Molecule.Models;

public class CommonResult<T>
{
    public Codes Code { get; init; } = Codes.Ok;
    public string? Message { get; init; } = "";
    public T? Data { get; init; } = default(T);
}

public class SelectData<T>
{
    public int Count { get; init; } = 0;
    public List<T> List { get; init; } = new List<T>();
}


public class MSelectResult<T>
{
    [JsonPropertyName("page")] public int Page { get; set; }

    [JsonPropertyName("size")] public int Size { get; set; }

    [JsonPropertyName("count")] public int Count { get; init; }

    [JsonPropertyName("range")] public List<T> Range { get; init; } = new();

    public static MSelectResult<T> New(int page, int size, int count, List<T> range)
    {
        return new MSelectResult<T>
        {
            Page = page,
            Size = size,
            Count = count,
            Range = range
        };
    }

    public MSelectResult<T> AddRange(params T[] range)
    {
        Range.AddRange(range);
        return this;
    }
}
