#include <iostream>
#include "galaxy/quantum/services/database/SqliteService.h"
#include "sqlite.h"

int calieo::telescope::examples::sqlite::TestSqliteVersion()
{
    auto database_path = "polaris.sqlite";
    auto sqliteService = quantum::SqliteService();
    auto dbHandle = sqliteService.openDatabase(database_path);
    auto version = sqliteService.sqliteVersion(dbHandle);

    std::cout << "Sqlite version: " << version << std::endl;
    return (int)version.starts_with("3.");
}

int calieo::telescope::examples::sqlite::TestSqliteSelect()
{
    auto database_path = "polaris.sqlite";
    auto sqliteService = quantum::SqliteService();
    auto dbHandle = sqliteService.openDatabase(database_path);
    std::string sqlText = "SELECT * FROM sqlite_master;";
    auto sqlResult = sqliteService.runSql(dbHandle, sqlText);
    auto rowCount = sqlResult.getRowCount();
    if (rowCount < 1)
    {
        std::cout << "table is empty" << std::endl;
        return 0;
    }
    auto nameColumn = sqlResult.getColumn(0, "name");
    if (!nameColumn.has_value())
    {
        std::cout << "name column not found" << std::endl;
        return 0;
    }
    auto title = nameColumn.value().getStringValue();

    std::cout << "table name: " << title << std::endl;
    return 0;
}
