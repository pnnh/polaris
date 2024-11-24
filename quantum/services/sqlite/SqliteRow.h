#pragma once

#include <iostream>
#include <map>
#include <optional>
#include <sqlite3.h>
#include <string>
#include <vector>
#include "base/services/sqlite/SqliteColumn.h"

namespace polaris::base
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

