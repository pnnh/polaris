
#include "SqliteService.h"
#include <sqlite3.h>

quantum::SqliteService::SqliteService(): sqlite3Database(nullptr)
{
}

quantum::SqliteService::SqliteService(const std::string& path)
{
    sqlite3* db;
    auto cPath = path.c_str();
    int rc = sqlite3_open(cPath, &db);
    if (rc) throw quantum::PSException("Can't open database", sqlite3_errmsg(db));

    this->sqlite3Database = db;
}

quantum::SqliteService::~SqliteService()
{
    auto rc = sqlite3_close(this->sqlite3Database);
    if (rc)
    {
        std::cerr << "Can't close database: " << rc << " " << sqlite3_errmsg(this->sqlite3Database) << std::endl;
    }
}

quantum::SqliteResult quantum::SqliteService::runSql(const std::string& sqlText)
{
    auto command = createCommand(sqlText);
    auto runResult = command->Run();
    if (runResult == nullptr) throw PSException("Can't run sql command");
    return *runResult;
}

quantum::SqliteResult quantum::SqliteService::runSql(const std::string&& text)
{
    return runSql(text);
}

std::shared_ptr<quantum::SqliteCommand> quantum::SqliteService::createCommand(const std::string& sqlText)
{
    sqlite3_stmt* stmt;
    auto rc = sqlite3_prepare_v2(this->sqlite3Database, sqlText.c_str(), static_cast<int>(sqlText.length() + 1),
                                 &stmt, nullptr);
    if (rc) throw PSException("Can't prepare statement", sqlite3_errmsg(this->sqlite3Database));

    return std::make_shared<SqliteCommand>(this->sqlite3Database, stmt, sqlText);
}

void quantum::SqliteService::runSqlBatch(const std::vector<std::string>& sqlTextVector)
{
    for (const auto& sqlText : sqlTextVector)
    {
        runSql(sqlText);
    }
}

std::string quantum::SqliteService::sqliteVersion()
{
    auto sqlResult = runSql("SELECT sqlite_version() as version;");
    auto verColumn = sqlResult.getColumn(0, 0);
    if (!verColumn.has_value()) throw PSException("Can't get sqlite version");

    return verColumn.value().getStringValue();
}

