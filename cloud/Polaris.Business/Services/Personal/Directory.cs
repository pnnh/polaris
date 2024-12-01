namespace Polaris.Business.Services;

using System.Data.Entity;
using System.Text;
using Polaris.Business.Helpers;
using Polaris.Business.Models;
using Polaris.Business.Models.Personal;

public class DirectoryService
{
    private readonly ServiceContext serviceContext;

    public DirectoryService(ServiceContext serviceContext)
    {
        this.serviceContext = serviceContext;
    }

    public List<DirectoryModel> RenderDirectoryTree(List<DirectoryModel> directories, string? parent = null)
    {
        var resultList = directories.Where(p => parent == null ? string.IsNullOrEmpty(p.Parent) : p.Parent == parent).ToList();

        resultList.ForEach(p =>
        {
            var children = RenderDirectoryTree(directories, p.Pk);
            p.Children = children;
        });

        return resultList;
    }
}
