#include "SqliteCommand.h"

#include <quantum/types/Exception.h>

#include <utility>

quantum::SqliteCommand::SqliteCommand(sqlite3* sqlite3Database, sqlite3_stmt* stmt,
                                      std::string sqlText) : sqlite3Database(sqlite3Database), stmt(stmt),
                                                             sqlText(std::move(sqlText))
{
}

quantum::SqliteCommand::~SqliteCommand()
{
    if (this->stmt != nullptr)
        sqlite3_finalize(this->stmt);
}

void quantum::SqliteCommand::ChangeSqlText(const std::string& text)
{
    if (this->stmt != nullptr)
        sqlite3_finalize(this->stmt);

    this->sqlText = text;
    auto rc = sqlite3_prepare_v2(this->sqlite3Database, text.c_str(), static_cast<int>(text.length() + 1),
                                 &this->stmt, nullptr);
    if (rc) throw PSException("Can't prepare statement", sqlite3_errmsg(this->sqlite3Database));
}

void quantum::SqliteCommand::BindInt(const std::string& name, int value)
{
    auto index = sqlite3_bind_parameter_index(this->stmt, name.c_str());
    auto rc = sqlite3_bind_int(this->stmt, index, value);
    if (rc) throw PSException("Can't bind int value", sqlite3_errmsg(this->sqlite3Database));
}

void quantum::SqliteCommand::BindString(const std::string& name, const std::string& value)
{
    auto index = sqlite3_bind_parameter_index(this->stmt, name.c_str());
    auto rc = sqlite3_bind_text(this->stmt, index, value.c_str(), -1, nullptr);
    if (rc) throw PSException("Can't bind string value", sqlite3_errmsg(this->sqlite3Database));
}

void quantum::SqliteCommand::Reset()
{
    auto rc = sqlite3_reset(this->stmt);
    if (rc) throw PSException("Can't reset statement", sqlite3_errmsg(this->sqlite3Database));
}

std::shared_ptr<quantum::SqliteResult> quantum::SqliteCommand::Run()
{
    auto row = 0;
    auto sqlResult = std::make_shared<SqliteResult>();
    while (true)
    {
        int step = sqlite3_step(stmt);
        if (step == SQLITE_ROW)
        {
            SqliteRow sqlRow;
            // int bytes;
            // const unsigned char* text;
            auto count = sqlite3_column_count(stmt);
            for (int colIndex = 0; colIndex < count; ++colIndex)
            {
                //bytes = sqlite3_column_bytes(stmt, 0);
                auto colType = sqlite3_column_type(stmt, colIndex);
                auto colName = sqlite3_column_name(stmt, colIndex);

                // auto colNameString = std::string(reinterpret_cast<const char*>(colName));
                auto sqlColumn = SqliteColumn(colType, colIndex, colName);

                switch (colType)
                {
                case SQLITE_TEXT:
                    {
                        auto colText = sqlite3_column_text(stmt, colIndex);
                        auto colTextString = std::string(reinterpret_cast<const char*>(colText));
                        sqlColumn.setStringValue(std::move(colTextString));
                        break;
                    }
                case SQLITE_INTEGER:
                    {
                        sqlColumn.setIntValue(sqlite3_column_int(stmt, colIndex));
                        break;
                    }
                case SQLITE_FLOAT:
                    {
                        sqlColumn.setFloatValue(sqlite3_column_double(stmt, colIndex));
                        break;
                    }
                case SQLITE_NULL:
                    {
                        sqlColumn.setNull();
                        break;
                    }
                default: { break; }
                }

                sqlRow.appendColumn(std::move(sqlColumn));
            }
            sqlResult->appendRow(std::move(sqlRow));
            row++;
        }
        else if (step == SQLITE_DONE)
        {
            break;
        }
        else
        {
            throw PSException("Can't step statement: ", sqlite3_errmsg(this->sqlite3Database));
        }
    }
    return sqlResult;
}
