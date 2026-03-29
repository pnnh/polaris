using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Npgsql;
using Polaris.Business.Models.Community;
using Polaris.Business.Models.Personal;
using Polaris.Business.Models.Public;

namespace Polaris.Business.Models;

public interface IDatabaseContextFactory
{
    DatabaseContext CreateDbContext();
}

public class DatabaseContextFactory : IDatabaseContextFactory
{
    private const string CacheKey = "SecondConnectionString";
    private const string DataSourceCacheKey = "NpgsqlDataSource";
    private readonly IMemoryCache _cache;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DatabaseContextFactory> _logger;
    private readonly ILoggerFactory _loggerFactory;

    public DatabaseContextFactory(IConfiguration configration, ILogger<DatabaseContextFactory> logger,
        IMemoryCache cache, ILoggerFactory loggerFactory)
    {
        _configuration = configration;
        _logger = logger;
        _cache = cache;
        _loggerFactory = loggerFactory;
    }

    public DatabaseContext CreateDbContext()
    {
        if (!_cache.TryGetValue(CacheKey, out string? secondConnectionString))
            try
            {
                secondConnectionString = _configuration["ConnectionString"] ??
                                         throw new Exception("Second DB connection string not found in configuration.");
                _cache.Set(CacheKey, secondConnectionString, TimeSpan.FromHours(1));
                _logger.LogInformation("Fetched and cached second DB connection string.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch second DB connection string.");
                throw;
            }

        // Cache the data source to avoid creating multiple service providers
        if (!_cache.TryGetValue(DataSourceCacheKey, out NpgsqlDataSource? dbDataSource))
        {
            dbDataSource = new NpgsqlDataSourceBuilder(secondConnectionString).Build();
            _cache.Set(DataSourceCacheKey, dbDataSource, TimeSpan.FromHours(1));
        }

        var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();

        optionsBuilder.UseNpgsql(dbDataSource!)
            .UseLoggerFactory(_loggerFactory) // Use the injected singleton logger factory
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors();


        return new DatabaseContext(optionsBuilder.Options);
    }
}

public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{
    public DbSet<CmFileModel> CommunityFiles => Set<CmFileModel>();
    public DbSet<PsFileModel> PersonalFiles => Set<PsFileModel>();
    public DbSet<DeAccountModel> Accounts => Set<DeAccountModel>();
    public DbSet<CmChannelModel> CommunityChannels => Set<CmChannelModel>();
    public DbSet<CmToolModel> CommunityTools => Set<CmToolModel>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);
        configurationBuilder
            .Properties<DateTime>()
            .HaveConversion<DateTimeConverter>();
    }
}

public class DateTimeConverter() : ValueConverter<DateTime, DateTime>(v => ConvertTo(v), v => ConvertFrom(v))
{
    private static DateTime ConvertTo(DateTime v)
    {
        var newValue = v.ToUniversalTime();
        return newValue;
    }

    private static DateTime ConvertFrom(DateTime v)
    {
        var newValue = new DateTime(v.Ticks, DateTimeKind.Utc);
        return newValue;
    }
}