#pragma once

// #include <iostream>
//#include <string>
#include <vector>
#include "quantum/services/database/SqliteRow.h"

namespace quantum
{
    class SqliteResult
    {
    public:
        SqliteResult(): rows()
        {
        }

        void appendRow(const SqliteRow&& row);
        std::optional<SqliteRow> getRow(int index);
        [[nodiscard]] unsigned int getRowCount() const;
        std::optional<SqliteColumn> getColumn(int rowIndex, int colIndex);
        std::optional<SqliteColumn> getColumn(int rowIndex, const char* colName);
        std::optional<SqliteColumn> getColumn(int rowIndex, const std::string& colName);
        std::optional<SqliteColumn> getColumn(int rowIndex, const std::string&& colName);

    private:
        std::vector<SqliteRow> rows;
    };
}

