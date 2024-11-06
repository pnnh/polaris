#pragma once

#include <map>
#include <sqlite3.h>
#include <string>
#include "native/models/protocol/Exception.h"
#include "native/services/sqlite/SqliteResult.h"

namespace polaris::native::services::sqlite
{
    typedef unsigned long SqliteHandle;

    class SqliteService
    {
    public:
        SqliteService();
        ~SqliteService();

        SqliteService(const SqliteService&) = delete;
        SqliteService& operator=(const SqliteService&) = delete;
        SqliteService(SqliteService&&) = delete;
        SqliteService& operator=(SqliteService&&) = delete;


        SqliteHandle openDatabase(const char* path);
        SqliteHandle openDatabase(std::string&& path);
        models::protocol::QuantumError closeDatabase(SqliteHandle dbHandle);
        SqliteResult runSql(SqliteHandle dbHandle, std::string& text);
        SqliteResult runSql(SqliteHandle dbHandle, std::string&& text);
        std::string sqliteVersion(SqliteHandle dbHandle);

    private:
        std::map<SqliteHandle, sqlite3*> dbHandles;
    };
}

