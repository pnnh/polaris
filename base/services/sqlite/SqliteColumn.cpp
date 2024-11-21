#include "SqliteColumn.h"

#include <sqlite3.h>

#include "base/types/Exception.h"


polaris::base::SqliteColumn::SqliteColumn() : colType(), colIndex()
{
}

polaris::base::SqliteColumn::SqliteColumn(const int colType, const int colIndex, const std::string&& colName) :
    colType(colType), colIndex(colIndex),
    colName(colName)
{
    if (colIndex < 0) throw polaris::base::QuantumException("列索引必须大于等于0");
}

polaris::base::SqliteColumn::~SqliteColumn()
{
}

polaris::base::SqliteColumn::SqliteColumn(const SqliteColumn& other) :
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

polaris::base::SqliteColumn& polaris::base::SqliteColumn::operator=(const SqliteColumn& other)
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

polaris::base::SqliteColumn::SqliteColumn(SqliteColumn&& other) noexcept :
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

polaris::base::SqliteColumn& polaris::base::SqliteColumn::operator=(SqliteColumn&& other) noexcept
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

int polaris::base::SqliteColumn::getColIndex() const
{
    return colIndex;
}

std::string polaris::base::SqliteColumn::getColName() const
{
    if (colName.empty()) return "column" + std::to_string(colIndex);
    return colName;
}

std::string polaris::base::SqliteColumn::getStringValue() const
{
    return variantValue.index() == 0 ? std::get<std::string>(variantValue) : "";
}

void polaris::base::SqliteColumn::setStringValue(const char* value)
{
    // stringValue = value;
    variantValue = std::string(value);
}

void polaris::base::SqliteColumn::setStringValue(const std::string& value)
{
    // stringValue = value;
    variantValue = value;
}

void polaris::base::SqliteColumn::setStringValue(const std::string&& value)
{
    // stringValue = value;
    variantValue = value;
}

int polaris::base::SqliteColumn::getIntValue() const
{
    // return intValue;
    return variantValue.index() == 1 ? static_cast<int>(std::get<long>(variantValue)) : 0;
}

void polaris::base::SqliteColumn::setIntValue(int value)
{
    // intValue = value;
    variantValue = static_cast<long>(value);
}

double polaris::base::SqliteColumn::getFloatValue() const
{
    // return floatValue;
    return variantValue.index() == 2 ? std::get<double>(variantValue) : 0;
}

void polaris::base::SqliteColumn::setFloatValue(double value)
{
    // floatValue = value;
    variantValue = value;
}

int polaris::base::SqliteColumn::getColType() const
{
    return colType;
}

bool polaris::base::SqliteColumn::isNull() const
{
    return colIsNull;
}

void polaris::base::SqliteColumn::setNull()
{
    colIsNull = true;
}
