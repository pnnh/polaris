using AutoMapper;
using AutoMapper.Data;

namespace Polaris.Business.Helpers;

public class MapperHelper
{
    public static IMapper GetMapper()
    {
        var configuration = new MapperConfiguration(cfg =>
        {
            cfg.AddDataReaderMapping(); 

            cfg.CreateMap<DateTime, DateTime>().ConvertUsing<DateTimeTypeConverter>();
            cfg.AddProfile<AutoMapperProfile2>();
        });
#if DEBUG
        configuration.AssertConfigurationIsValid();
#endif
        configuration.CompileMappings();
        var mapper = configuration.CreateMapper();

        return mapper;
    }
    
}

internal class DateTimeTypeConverter : ITypeConverter<DateTime, DateTime>
{
    public DateTime Convert(DateTime source, DateTime destination, ResolutionContext context)
    {
        var newValue = new DateTime(source.Ticks, DateTimeKind.Utc);
        return newValue;
    }
}

