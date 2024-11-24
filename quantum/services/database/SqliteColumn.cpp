#include "SqliteColumn.h"

#include <sqlite3.h>

#include "quantum/types/Exception.h"


quantum::SqliteColumn::SqliteColumn() : colType(), colIndex()
{
}

quantum::SqliteColumn::SqliteColumn(const int colType, const int colIndex, const std::string&& colName) :
    colType(colType), colIndex(colIndex),
    colName(colName)
{
    if (colIndex < 0) throw quantum::PSException("列索引必须大于等于0");
}

quantum::SqliteColumn::~SqliteColumn()
{
}

quantum::SqliteColumn::SqliteColumn(const SqliteColumn& other) :
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

quantum::SqliteColumn& quantum::SqliteColumn::operator=(const SqliteColumn& other)
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

quantum::SqliteColumn::SqliteColumn(SqliteColumn&& other) noexcept :
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

quantum::SqliteColumn& quantum::SqliteColumn::operator=(SqliteColumn&& other) noexcept
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

int quantum::SqliteColumn::getColIndex() const
{
    return colIndex;
}

std::string quantum::SqliteColumn::getColName() const
{
    if (colName.empty()) return "column" + std::to_string(colIndex);
    return colName;
}

std::string quantum::SqliteColumn::getStringValue() const
{
    return variantValue.index() == 0 ? std::get<std::string>(variantValue) : "";
}

void quantum::SqliteColumn::setStringValue(const char* value)
{
    // stringValue = value;
    variantValue = std::string(value);
}

void quantum::SqliteColumn::setStringValue(const std::string& value)
{
    // stringValue = value;
    variantValue = value;
}

void quantum::SqliteColumn::setStringValue(const std::string&& value)
{
    // stringValue = value;
    variantValue = value;
}

int quantum::SqliteColumn::getIntValue() const
{
    // return intValue;
    return variantValue.index() == 1 ? static_cast<int>(std::get<long>(variantValue)) : 0;
}

void quantum::SqliteColumn::setIntValue(int value)
{
    // intValue = value;
    variantValue = static_cast<long>(value);
}

double quantum::SqliteColumn::getFloatValue() const
{
    // return floatValue;
    return variantValue.index() == 2 ? std::get<double>(variantValue) : 0;
}

void quantum::SqliteColumn::setFloatValue(double value)
{
    // floatValue = value;
    variantValue = value;
}

int quantum::SqliteColumn::getColType() const
{
    return colType;
}

bool quantum::SqliteColumn::isNull() const
{
    return colIsNull;
}

void quantum::SqliteColumn::setNull()
{
    colIsNull = true;
}
