using System.Text.Json;

namespace Molecule.Helpers;

public class JsonHelper
{
    private object? _jsonNode;

    public static async Task<JsonHelper> NewAsync(Stream stream)
    {
        var reader = new StreamReader(stream);
        var jsonText = await reader.ReadToEndAsync();
        var jsonNode = JsonSerializer.Deserialize<object>(jsonText);
        var jsonHelper = new JsonHelper
        {
            _jsonNode = jsonNode
        };

        return jsonHelper;
    }

    public string? GetString(string name)
    {
        if (_jsonNode is JsonElement element)
            if (element.TryGetProperty(name, out var value))
                return value.GetString();
        return null;
    }

    public int? GetInt(string name)
    {
        if (_jsonNode is JsonElement element)
            if (element.TryGetProperty(name, out var value))
                return value.TryGetInt32(out var intValue) ? intValue : null;
        return null;
    }

    public long? GetLong(string name)
    {
        if (_jsonNode is JsonElement element)
            if (element.TryGetProperty(name, out var value))
                return value.TryGetInt64(out var intValue) ? intValue : null;
        return null;
    }
}