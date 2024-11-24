using System.Collections.Specialized;
using System.Web;
using Microsoft.AspNetCore.Http;

namespace Molecule.Helpers;

public class MQueryHelper
{

    private readonly Dictionary<string, string> _query = new Dictionary<string, string>();

    public MQueryHelper(string queryString)
    {
        var collection = HttpUtility.ParseQueryString(queryString);
        foreach (var key in collection.AllKeys)
        {
            var value = collection[key];
            if (key == null || value == null) continue;

            _query.Add(key, value);
        }
    }

    public MQueryHelper(NameValueCollection query)
    {
        _query = query.AllKeys.ToDictionary(k => k!, k => query[k] ?? "");
    }

    public MQueryHelper(IQueryCollection query)
    {
        _query = query.ToDictionary(k => k.Key,
            k => k.Value.ToString());
    }


    public int? GetInt(string name)
    {
        if (_query.TryGetValue(name, out var value))
            if (int.TryParse(value, out var intValue))
                return intValue;

        return null;
    }

    public long? GetLong(string name)
    {
        if (_query.TryGetValue(name, out var value))
            if (long.TryParse(value, out var intValue))
                return intValue;

        return null;
    }

    public string? GetString(string name)
    {
        if (_query.TryGetValue(name, out var value)) return value;

        return null;
    }

    public string[]? GetStringArray(string name)
    {
        if (_query.TryGetValue(name, out var value))
        {
            return value.Split(',');
        }
        if (_query.TryGetValue(name + "[]", out var value2))
        {
            return value2.Split(',');
        }

        return null;
    }

    public DateTime? GetDateTime(string name)
    {
        if (_query.TryGetValue(name, out var value))
            if (DateTime.TryParse(value, out var dateTimeValue))
                return dateTimeValue;

        return null;
    }
}