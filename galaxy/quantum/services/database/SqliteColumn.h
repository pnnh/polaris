#pragma once

#include <iostream>
#include <string>
#include <variant>

namespace quantum
{
    class SqliteColumn
    {
    public:
        SqliteColumn();
        SqliteColumn(int colType, int colIndex, const std::string&& colName);
        ~SqliteColumn();

        SqliteColumn(const SqliteColumn&);
        SqliteColumn& operator=(const SqliteColumn&);
        SqliteColumn(SqliteColumn&&) noexcept;
        SqliteColumn& operator=(SqliteColumn&&) noexcept;

        [[nodiscard]] int getColIndex() const;
        [[nodiscard]] std::string getColName() const;
        [[nodiscard]] int getColType() const;

        [[nodiscard]] bool isNull() const;
        void setNull();

        [[nodiscard]] std::string getStringValue() const;
        void setStringValue(const char* value);
        void setStringValue(const std::string& value);
        void setStringValue(const std::string&& value);

        [[nodiscard]] int getIntValue() const;
        void setIntValue(int value);

        [[nodiscard]] double getFloatValue() const;
        void setFloatValue(double value);

    private:
        int colType;
        int colIndex;
        std::string colName;
        bool colIsNull{};

        // std::string stringValue;
        // int intValue{};
        // double floatValue;

        std::variant<std::string, long, double> variantValue;
    };
}

