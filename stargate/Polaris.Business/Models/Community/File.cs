using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Polaris.Business.Models.Personal;

namespace Polaris.Business.Models.Community;

[Table("files", Schema = "community")] 
public class CmFileModel : PsFileModel
{
}