#include "SqliteColumn.h"

#include <sqlite3.h>

#include "native/models/protocol/Exception.h"

namespace sqlite = polaris::native::services::sqlite;

polaris::native::services::sqlite::SqliteColumn::SqliteColumn() : colType(), colIndex()
{
}

polaris::native::services::sqlite::SqliteColumn::SqliteColumn(const int colType, const int colIndex, const std::string&& colName) :
    colType(colType), colIndex(colIndex),
    colName(colName)
{
    if (colIndex < 0) throw polaris::native::models::protocol::QuantumException("列索引必须大于等于0");
}

polaris::native::services::sqlite::SqliteColumn::~SqliteColumn()
{
}

polaris::native::services::sqlite::SqliteColumn::SqliteColumn(const SqliteColumn& other) :
    colType(other.colType), colIndex(other.colIndex),
    colName(other.colName), colIsNull(other.colIsNull)
{
    // if (colType == SQLITE_TEXT)
    // {
    //     stringValue = other.stringValue;
    // }
    // else if (colType == SQLITE_INTEGER)
    // {
    //     intValue = other.intValue;
    // }
    // else if (colType == SQLITE_FLOAT)
    // {
    //     floatValue = other.floatValue;
    // }
    variantValue = other.variantValue;
}

polaris::native::services::sqlite::SqliteColumn& polaris::native::services::sqlite::SqliteColumn::operator=(const SqliteColumn& other)
{
    colType = other.colType;
    colIndex = other.colIndex;
    colName = other.colName;
    colIsNull = other.colIsNull;
    // if (colType == SQLITE_TEXT)
    // {
    //     stringValue = other.stringValue;
    // }
    // else if (colType == SQLITE_INTEGER)
    // {
    //     intValue = other.intValue;
    // }
    // else if (colType == SQLITE_FLOAT)
    // {
    //     floatValue = other.floatValue;
    // }
    variantValue = other.variantValue;
    return *this;
}

polaris::native::services::sqlite::SqliteColumn::SqliteColumn(SqliteColumn&& other) noexcept :
    colType(other.colType), colIndex(other.colIndex),
    colName(std::move(other.colName)), colIsNull(other.colIsNull)
{
    // if (colType == SQLITE_TEXT)
    // {
    //     stringValue = std::move(other.stringValue);
    // }
    // else if (colType == SQLITE_INTEGER)
    // {
    //     intValue = other.intValue;
    // }
    // else if (colType == SQLITE_FLOAT)
    // {
    //     floatValue = other.floatValue;
    // }
    variantValue = std::move(other.variantValue);
}

polaris::native::services::sqlite::SqliteColumn& polaris::native::services::sqlite::SqliteColumn::operator=(SqliteColumn&& other) noexcept
{
    colType = other.colType;
    colIndex = other.colIndex;
    colName = std::move(other.colName);
    colIsNull = other.colIsNull;

    // if (colType == SQLITE_TEXT)
    // {
    //     stringValue = std::move(other.stringValue);
    // }
    // else if (colType == SQLITE_INTEGER)
    // {
    //     intValue = other.intValue;
    // }
    // else if (colType == SQLITE_FLOAT)
    // {
    //     floatValue = other.floatValue;
    // }
    variantValue = std::move(other.variantValue);
    other.colType = 0;
    other.colIndex = 0;
    other.colName.clear();
    other.colIsNull = false;
    // other.stringValue.clear();
    // other.intValue = 0;
    // other.floatValue = 0;
    return *this;
}

int polaris::native::services::sqlite::SqliteColumn::getColIndex() const
{
    return colIndex;
}

std::string polaris::native::services::sqlite::SqliteColumn::getColName() const
{
    if (colName.empty()) return "column" + std::to_string(colIndex);
    return colName;
}

std::string polaris::native::services::sqlite::SqliteColumn::getStringValue() const
{
    return variantValue.index() == 0 ? std::get<std::string>(variantValue) : "";
}

void polaris::native::services::sqlite::SqliteColumn::setStringValue(const char* value)
{
    // stringValue = value;
    variantValue = std::string(value);
}

void polaris::native::services::sqlite::SqliteColumn::setStringValue(const std::string& value)
{
    // stringValue = value;
    variantValue = value;
}

void polaris::native::services::sqlite::SqliteColumn::setStringValue(const std::string&& value)
{
    // stringValue = value;
    variantValue = value;
}

int polaris::native::services::sqlite::SqliteColumn::getIntValue() const
{
    // return intValue;
    return variantValue.index() == 1 ? static_cast<int>(std::get<long>(variantValue)) : 0;
}

void polaris::native::services::sqlite::SqliteColumn::setIntValue(int value)
{
    // intValue = value;
    variantValue = static_cast<long>(value);
}

double polaris::native::services::sqlite::SqliteColumn::getFloatValue() const
{
    // return floatValue;
    return variantValue.index() == 2 ? std::get<double>(variantValue) : 0;
}

void polaris::native::services::sqlite::SqliteColumn::setFloatValue(double value)
{
    // floatValue = value;
    variantValue = value;
}

int polaris::native::services::sqlite::SqliteColumn::getColType() const
{
    return colType;
}

bool polaris::native::services::sqlite::SqliteColumn::isNull() const
{
    return colIsNull;
}

void polaris::native::services::sqlite::SqliteColumn::setNull()
{
    colIsNull = true;
}
