using Polaris.Business.Models;

namespace Polaris.Business.Services;

public class ServiceContext {
    public DatabaseContext DataContext { get; set; }
    public ServiceContext(DatabaseContext dataContext) {
        this.DataContext = dataContext;
        
    }
}