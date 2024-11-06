#include <iostream>
#include "native/services/sqlite/SqliteService.h"
#include "cases.h"

int polaris::native::examples::TestSqliteVersion()
{
    auto database_path = "polaris.sqlite";
    auto sqliteService = polaris::native::services::sqlite::SqliteService();
    auto dbHandle = sqliteService.openDatabase(database_path);
    auto version = sqliteService.sqliteVersion(dbHandle);

    std::cout << "Sqlite version: " << version << std::endl;
    return (int)version.starts_with("3.");
}

int polaris::native::examples::TestSqliteSelect()
{
    auto database_path = "polaris.sqlite";
    auto sqliteService = polaris::native::services::sqlite::SqliteService();
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

int polaris::native::examples::TestHelloWorld()
{
    std::cout << "TestHelloWorld: OK" << std::endl;
    return 0;
}
