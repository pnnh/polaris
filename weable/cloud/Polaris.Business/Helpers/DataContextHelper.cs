using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Data.Common;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Polaris.Business.Models;

namespace Polaris.Business.Helpers;

public static class DatabaseContextHelper
{
    public static List<T> RawSqlQuery<T>(DatabaseContext databaseContext, string query,
        Dictionary<string, object>? parameters)
    {
        using var command = databaseContext.Database.GetDbConnection().CreateCommand();
       
        databaseContext.Database.OpenConnection();
        
        PrepareCommand(command, query, parameters);

        using var reader = command.ExecuteReader();
        var mapper = MapperHelper.GetMapper();

        return mapper.Map<IDataReader, List<T>>(reader);
    }

    public static T? RawSqlScalar<T>(DatabaseContext databaseContext, string query,
        Dictionary<string, object>? parameters)
    {
        using var command = databaseContext.Database.GetDbConnection().CreateCommand();
        
        databaseContext.Database.OpenConnection();
        
        PrepareCommand(command, query, parameters);
        
        var value = command.ExecuteScalar();

        var mapper = MapperHelper.GetMapper();

        return value == null ? default : mapper.Map<object, T>(value);
    }
    
    private static void PrepareCommand(DbCommand command, string query,
        Dictionary<string, object>? parameters)
    {
        //command.CommandText = $"SET time_zone = '+00:00';" + query;
        command.CommandText = query;
        command.CommandType = CommandType.Text;
        if (parameters == null) return;
        foreach (var parameter in parameters)
        {
            var dbParameter = command.CreateParameter();
            dbParameter.ParameterName = parameter.Key;
            dbParameter.Value = parameter.Value;
            if (parameter.Value is DateTime dateTime)
                dbParameter.Value = dateTime.ToUniversalTime();
            command.Parameters.Add(dbParameter);
        }
    }
}