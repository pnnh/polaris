#pragma once

#include <iostream>
#include <map>
#include <optional>
#include <sqlite3.h>
#include <string>
#include <vector>
#include "native/services/sqlite/SqliteColumn.h"

namespace native::services::sqlite
{
    class SqliteRow
    {
    public:
        SqliteRow(): colNames(), columnValues()
        {
        }

        void appendColumn(const SqliteColumn&& column);
        std::optional<SqliteColumn> getColumn(const std::string&& colName);
        std::optional<SqliteColumn> getColumn(int colIndex);

    private:
        std::vector<std::string> colNames;
        std::map<int, SqliteColumn> columnValues;
    };
}

