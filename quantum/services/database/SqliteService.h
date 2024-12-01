#pragma once

#include <sqlite3.h>
#include <memory>
#include "SqliteCommand.h"
#include "quantum/types/Exception.h"
#include "quantum/services/database/SqliteResult.h"

namespace quantum
{
    class SqliteService
    {
    public:
        SqliteService();
        explicit SqliteService(const std::string& path);
        ~SqliteService();

        SqliteService(const SqliteService&) = delete;
        SqliteService& operator=(const SqliteService&) = delete;
        SqliteService(SqliteService&&) = delete;
        SqliteService& operator=(SqliteService&&) = delete;

        SqliteResult runSql(const std::string& text);
        SqliteResult runSql(const std::string&& text);

        std::shared_ptr<SqliteCommand> createCommand(const std::string& text);

        void runSqlBatch(const std::vector<std::string>& sqlTextVector);

        std::string sqliteVersion();

    private:
        sqlite3* sqlite3Database;
    };
}

