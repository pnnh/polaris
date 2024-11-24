namespace Polaris.Business.Services;

using System.Data.Entity;
using System.Text;
using Polaris.Business.Helpers;
using Polaris.Business.Models;

public class PartitionService
{
    private readonly ServiceContext serviceContext;

    public PartitionService(ServiceContext serviceContext)
    {
        this.serviceContext = serviceContext;
    }

    public PartitionQueryModel? QueryByPath(string[] pathArray)
    {
        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        if (pathArray == null || pathArray.Length == 0)
        {
            return null;
        }

        var rootName = pathArray[0];
        var leafName = pathArray[^1];
        var leafLevel = pathArray.Length;
        
        sqlBuilder.Append(@"
with recursive result(root_pk, root_name, leaf_pk, leaf_name, root_level, path, parent) as (
    select pk, name, p.pk, p.name, level, name::varchar(8192), parent
    from partitions p where name = @leaf and level = @leafLevel
    union
    select p2.pk, p2.name, self.leaf_pk, self.leaf_name, p2.level, (p2.name || '/' || self.path)::varchar(8192), p2.parent
    from result self join partitions p2 on p2.pk = self.parent
)
select r.root_pk, r.root_name, r.leaf_pk, r.leaf_name, r.root_level, '/' || r.path as path, r.parent
from result r where r.root_name = @root and r.root_level = 1;
");
        parameters.Add("@leaf", leafName);
        parameters.Add("@leafLevel", leafLevel);
        parameters.Add("@root", rootName);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<PartitionQueryModel>(this.serviceContext.DataContext, querySqlText, parameters);

        var model = modelsQuery.FirstOrDefault();

        return model;
    }
}
