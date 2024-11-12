
#include "Notebook.h"


namespace articles = native::models::articles;

articles::PSNotebookModel::PSNotebookModel() = default;

articles::PSNotebookModel::PSNotebookModel(const std::string& title): Title(title)
{
}

