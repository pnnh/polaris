using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Molecule.Helpers;
using Polaris.Business.Helpers;
using Polaris.Business.Models;

namespace Polaris.Business.Services;

public class ModelService(DatabaseContext databaseContext)
{
    public T? GetByKey<T>(string name) where T : class
    {
        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        Guid? uid;
        if (Guid.TryParse(name, out var guidValue))
        {
            uid = guidValue;
        }
        else if (MIDHelper.Base58.GuidDecode(name) is { } baseValue)
        {
            uid = baseValue;
        }
        else
        {
            return null;
        }

        if (typeof(T).GetCustomAttributes(typeof(TableAttribute), true).FirstOrDefault()
            is not TableAttribute tableAttribute || string.IsNullOrEmpty(tableAttribute.Name))
        {
            return null;
        }

        var fullTableName = $"{tableAttribute.Name}";
        if (!string.IsNullOrEmpty(tableAttribute.Schema))
        {
            fullTableName = $"{tableAttribute.Schema}.{fullTableName}";
        }

        sqlBuilder.Append($"select a.* from {fullTableName} as a");
        sqlBuilder.Append(" where ");
        sqlBuilder.Append(" a.uid = @uid");
        parameters.Add("uid", uid);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<T>(databaseContext, querySqlText, parameters);

        var model = modelsQuery.FirstOrDefault();

        return model;
    }
}