#pragma once
#include <sqlite3.h>
#include <memory>

#include "SqliteResult.h"

namespace quantum
{
    class SqliteCommand
    {
    public:
        explicit SqliteCommand(sqlite3* sqlite3Database, sqlite3_stmt* stmt, std::string sqlText);
        ~SqliteCommand();

        void ChangeSqlText(const std::string& text);
        void BindInt(const std::string& name, int value);
        void BindString(const std::string& name, const std::string& value);

        void Reset();

        std::shared_ptr<SqliteResult> Run();

    private:
        std::string sqlText{};
        sqlite3_stmt* stmt;
        sqlite3* sqlite3Database;
    };
}
