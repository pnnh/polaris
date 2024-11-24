using Molecule.Helpers;
using Molecule.Models;
using Polaris.Business.Models.Polaris;

namespace Polaris.Business.Services;

public class PageService
{
    private readonly ServiceContext serviceContext;

    public PageService(ServiceContext serviceContext)
    {
        this.serviceContext = serviceContext;
    }

    public MSelectResult<PSArticleModel> Select(string queryString)
    {
        var queryHelper = new MQueryHelper(queryString);
        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = MPagination.CalcOffset(page, size);

        var totalCount = serviceContext.DataContext.PSArticles.Count();
        var models = serviceContext.DataContext.PSArticles.OrderByDescending(o => o.UpdateTime)
            .Skip(offset).Take(limit).ToList();

        return new MSelectResult<PSArticleModel>
        {
            Range = models,
            Count = totalCount
        };
    }

    public PSArticleModel? GetByQuery(MQueryHelper queryHelper)
    {
//         var profile = queryHelper.GetString("profile");
//         var channel = queryHelper.GetString("channel");
//         var pathArray = queryHelper.GetStringArray("path");
//
//         if (string.IsNullOrEmpty(profile) || string.IsNullOrEmpty(channel)
//             || pathArray == null || pathArray.Length < 2)
//         {
//             return null;
//         }
//
//         var pageName = pathArray[^1];
//         var sqlBuilder = new StringBuilder();
//         var parameters = new Dictionary<string, object>();
//
//         sqlBuilder.Append(@"
// select a.*, p.nickname as profile_name, c.name as channel_name, 
//     '/' || replace(pa.path::varchar, '.', '/') as path 
// from posts a 
//     join partitions pa on pa.uid = a.partition
//     join accounts as p on p.uid = a.owner
//     join channels as c on c.uid = a.channel
// where a.uid is not null and a.name = @page and p.username = @profile and c.name = @channel
// ");
//         parameters.Add("@profile", profile);
//         parameters.Add("@channel", channel);
//         parameters.Add("@page", pageName);
//
//         var querySqlText = sqlBuilder.ToString();
//
//         var modelsQuery = DatabaseContextHelper.RawSqlQuery<PageModel>(this.serviceContext.DataContext, querySqlText, parameters);
//
//         var model = modelsQuery.FirstOrDefault();
//
//         return model;
        return null;
    }
}