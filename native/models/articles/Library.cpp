#include "Library.h"

namespace articles = native::models::articles;

articles::PSLibraryModel::PSLibraryModel() = default;

articles::PSLibraryModel::PSLibraryModel(const std::string& title): Title(title)
{
}
