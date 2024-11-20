#pragma once

#include <iostream>
#include <optional>
#include <string>

namespace native
{
    enum class QuantumEnum
    {
        OK = 0,
        ERROR = 1
    };

    constexpr const char* QuantumEnumToString(QuantumEnum error)
    {
        switch (error)
        {
        case QuantumEnum::OK:
            return "OK";
        case QuantumEnum::ERROR:
            return "ERROR";
        default:
            return "UNKNOWN";
        }
    };

    class QuantumException : public std::exception
    {
    public:
        QuantumException();
        explicit QuantumException(const std::string& message);
        QuantumException(QuantumEnum error, std::string message);
        QuantumException(const char* firstMessage, const char* secondMessage);

        QuantumException(const QuantumException& other);
        QuantumException& operator=(const QuantumException& other);
        QuantumException(QuantumException&& other) noexcept;
        QuantumException& operator=(QuantumException&& other) noexcept;

        void AppendMessage(const std::string& message);

        [[nodiscard]]
        const char* what() const noexcept override
        {
            std::cerr << QuantumEnumToString(_codeEnum) << ": " << _exceptionMessage.value_or("") << std::endl;
            return QuantumEnumToString(_codeEnum);
        }

    private:
        QuantumEnum _codeEnum;
        std::optional<std::string> _exceptionMessage;
    };
}

