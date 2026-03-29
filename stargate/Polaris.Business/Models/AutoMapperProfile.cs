using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Reflection;
using AutoMapper;
using Polaris.Business.Models.Community;
using Polaris.Business.Models.Personal;

namespace Polaris.Business.Models;

public class AutoMapperProfile2 : Profile
{
    public AutoMapperProfile2()
    {
        CreateMap<IDataReader, CmChannelModel>().ForAllMembers(m =>
            m.MapFrom(src => Map(src, m.DestinationMember)));
        CreateMap<IDataReader, PsFileModel>().ForAllMembers(m =>
            m.MapFrom(src => Map(src, m.DestinationMember)));
        CreateMap<IDataReader, CmFileModel>().ForAllMembers(m =>
            m.MapFrom(src => Map(src, m.DestinationMember)));
        CreateMap<IDataReader, CmToolModel>().ForAllMembers(m =>
            m.MapFrom(src => Map(src, m.DestinationMember)));
    }

    private object Map(IDataReader dataReader, MemberInfo memberInfo)
    {
        var v = new PascalCaseNamingConvention();
        var colAttr = memberInfo.GetCustomAttributes().FirstOrDefault(t => t.GetType() == typeof(ColumnAttribute));

        if (memberInfo is not PropertyInfo) return new object();
        var propInfo = (PropertyInfo)memberInfo;

        if (!IsSimple(propInfo.PropertyType)) return new object();

        var destName = colAttr == null ? memberInfo.Name : ((ColumnAttribute)colAttr).Name;
        var arr = v.Split(destName);
        var colName = "";
        colName = arr.Length < 1 ? destName!.ToLower() : string.Join("_", arr.Select(a => a.ToLower()));

        try
        {
            // Check if column exists in the result set
            for (var i = 0; i < dataReader.FieldCount; i++)
                if (dataReader.GetName(i).Equals(colName, StringComparison.OrdinalIgnoreCase))
                {
                    var value = dataReader[colName];
                    return value == DBNull.Value ? GetDefaultValue(propInfo.PropertyType) : value;
                }

            // Column not found, return default value
            return GetDefaultValue(propInfo.PropertyType);
        }
        catch
        {
            return GetDefaultValue(propInfo.PropertyType);
        }
    }

    private object GetDefaultValue(Type type)
    {
        return type.IsValueType ? Activator.CreateInstance(type)! : null!;
    }

    private bool IsSimple(Type type)
    {
        var typeInfo = type.GetTypeInfo();
        if (typeInfo.IsGenericType && typeInfo.GetGenericTypeDefinition() == typeof(Nullable<>))
            return IsSimple(typeInfo.GetGenericArguments()[0]);
        return typeInfo.IsPrimitive
               || typeInfo.IsEnum
               || typeInfo.Equals(typeof(Guid))
               || type.Equals(typeof(string))
               || type.Equals(typeof(DateTime))
               //  || type.Equals(typeof(DateTimeOffset))
               || type.Equals(typeof(decimal));
    }

    internal class DateTimeTypeConverter : ITypeConverter<DateTime, DateTimeOffset>
    {
        public DateTimeOffset Convert(DateTime source, DateTimeOffset destination, ResolutionContext context)
        {
            var newValue = new DateTimeOffset(source.Ticks, TimeSpan.Zero);
            return newValue;
        }
    }
}