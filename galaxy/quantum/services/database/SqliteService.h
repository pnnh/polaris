#pragma once

#include <map>
#include <sqlite3.h>
#include <string>
#include "galaxy/quantum/types/Exception.h"
#include "galaxy/quantum/services/database/SqliteResult.h"

namespace quantum
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
        quantum::QuantumEnum closeDatabase(SqliteHandle dbHandle);
        SqliteResult runSql(SqliteHandle dbHandle, std::string& text);
        SqliteResult runSql(SqliteHandle dbHandle, std::string&& text);
        std::string sqliteVersion(SqliteHandle dbHandle);

    private:
        std::map<SqliteHandle, sqlite3*> dbHandles;
    };
}

