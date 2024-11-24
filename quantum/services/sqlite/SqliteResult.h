#pragma once

#include <iostream>
#include <map>
#include <sqlite3.h>
#include <string>
#include <vector>
#include "base/services/sqlite/SqliteRow.h"

namespace polaris::base
{
    class SqliteResult
    {
    public:
        SqliteResult(): rows()
        {
        }

        void appendRow(const SqliteRow&& row);
        std::optional<SqliteRow> getRow(int index);
        unsigned int getRowCount() const;
        std::optional<SqliteColumn> getColumn(int rowIndex, int colIndex);
        std::optional<SqliteColumn> getColumn(int rowIndex, const char* colName);
        std::optional<SqliteColumn> getColumn(int rowIndex, const std::string& colName);
        std::optional<SqliteColumn> getColumn(int rowIndex, const std::string&& colName);

    private:
        std::vector<SqliteRow> rows;
    };
}

