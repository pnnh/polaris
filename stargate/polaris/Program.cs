using System.Net.Mime;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Molecule.Models;
using Npgsql;
using Polaris.Business.Models;
using Polaris.Business.Services; 

namespace Polaris;

public static class PolarisApplication
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Logging.ClearProviders().AddSimpleConsole(options =>
        {
            options.SingleLine = false;
            options.IncludeScopes = true;
            options.UseUtcTimestamp = true;
        });

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin", policy =>
            {
                policy.WithOrigins("http://localhost:4200")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        builder.Services.AddControllersWithViews().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
        });
        builder.Services.AddMemoryCache();
        builder.Services.AddScoped<IDatabaseContextFactory, DatabaseContextFactory>();
        builder.Services.AddAuthentication()
            .AddScheme<AuthenticationSchemeOptions, OAuth2AuthenticationHandler>(
                OAuth2AuthenticationDefaults.AuthenticationScheme, null);
        builder.Services.AddExceptionHandler<CustomExceptionHandler>();

        var app = builder.Build();

        // 必须添加这个中间件才能启用异常处理器
        app.UseExceptionHandler(_ => { });
        
        app.UseStaticFiles();
        // 启用 CORS 中间件
        app.UseCors("AllowSpecificOrigin");
        app.UseRouting();
        app.UseAuthentication();

        app.MapAreaControllerRoute(
            name: "Community",
            areaName: "Community",
            pattern: "community/{controller=Home}/{action=Index}/{id?}");
        
        app.MapAreaControllerRoute(
            name: "Personal",
            areaName: "Personal",
            pattern: "personal/{controller=Home}/{action=Index}/{id?}");

        app.MapAreaControllerRoute(
            name: "Management",
            areaName: "Management",
            pattern: "management/{controller=Home}/{action=Index}/{id?}");

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
         

        app.UseAuthorization();

        app.Run();
    }

}

public class CustomExceptionHandler(ILogger<CustomExceptionHandler> logger, IWebHostEnvironment env) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    { 
        // 记录详细的异常信息到日志
        logger.LogError(exception, 
            "An unhandled exception occurred. Path: {Path}, Method: {Method}, Message: {Message}, StackTrace: {StackTrace}", 
            context.Request.Path, 
            context.Request.Method,
            exception.Message,
            exception.StackTrace);

        // 返回统一的错误响应
        context.Response.StatusCode = StatusCodes.Status200OK;
        context.Response.ContentType = MediaTypeNames.Application.Json;

        // 根据异常类型决定返回的错误信息
        var errorMessage = "unknown";
        var errorCode = 500;

        // 如果是业务异常(PLBizException)，使用异常消息
        if (exception.GetType().Name == "PLBizException")
        {
            errorMessage = exception.Message;
            errorCode = 400; // 业务错误使用400
        }
        // 在开发环境下，返回详细的错误信息
        else if (env.IsDevelopment())
        {
            errorMessage = $"{exception.GetType().Name}: {exception.Message}";
        }

        var commonResult = new PLExceptionResult
        {
            Code = errorCode,
            Message = errorMessage
        };
        
        var jsonResponse = JsonSerializer.Serialize(commonResult, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            Encoder = JavaScriptEncoder.Create(UnicodeRanges.All)
        });

        await context.Response.WriteAsync(jsonResponse, cancellationToken);

        return true;
    }
}