#include "SqliteRow.h"
#include <algorithm>

namespace sqlite = polaris::native::services::sqlite;

void sqlite::SqliteRow::appendColumn(const SqliteColumn &&column)
{
    columnValues[column.getColIndex()] = column;
    colNames.push_back(column.getColName());
}

std::optional<sqlite::SqliteColumn> sqlite::SqliteRow::getColumn(const std::string &&colName)
{
    auto indexIt = std::find(colNames.begin(), colNames.end(), colName);

    if (indexIt == colNames.end())
    {
        return std::nullopt;
    }

    auto index = std::distance(colNames.begin(), indexIt);
    return getColumn(static_cast<int>(index));
}

std::optional<sqlite::SqliteColumn> sqlite::SqliteRow::getColumn(int colIndex)
{
    auto it = columnValues.find(colIndex);
    if (it == columnValues.end())
        return std::nullopt;
    return it->second;
}
