#include "SqliteResult.h"

namespace sqlite = native::services::sqlite;

void sqlite::SqliteResult::appendRow(const sqlite::SqliteRow&& row)
{
    rows.push_back(row);
}

std::optional<sqlite::SqliteRow> sqlite::SqliteResult::getRow(int index)
{
    if (index < 0 || index >= rows.size()) return std::nullopt;
    return rows[index];
}

unsigned int sqlite::SqliteResult::getRowCount() const
{
    return this->rows.size();
}

std::optional<sqlite::SqliteColumn> sqlite::SqliteResult::getColumn(int rowIndex, int colIndex)
{
    auto sqlRow = getRow(rowIndex);
    if (!sqlRow.has_value()) return std::nullopt;
    return sqlRow.value().getColumn(colIndex);
}

std::optional<sqlite::SqliteColumn> sqlite::SqliteResult::getColumn(int rowIndex, const char* colName)
{
    return getColumn(rowIndex, std::string(colName));
}

std::optional<sqlite::SqliteColumn> sqlite::SqliteResult::getColumn(int rowIndex,
                                                                    const std::string& colName)
{
    return getColumn(rowIndex, std::move(colName));
}

std::optional<sqlite::SqliteColumn> sqlite::SqliteResult::getColumn(int rowIndex,
                                                                    const std::string&& colName)
{
    auto sqlRow = getRow(rowIndex);
    if (!sqlRow.has_value()) return std::nullopt;
    return sqlRow.value().getColumn(static_cast<std::string>(colName));
}
