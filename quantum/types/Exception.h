#pragma once

#include <iostream>
#include <optional>
#include <string>

#ifdef __cplusplus


namespace quantum
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

    class PSException : public std::exception
    {
    public:
        PSException();
        explicit PSException(const std::string& message);
        PSException(QuantumEnum error, std::string message);
        PSException(const char* firstMessage, const char* secondMessage);

        PSException(const PSException& other);
        PSException& operator=(const PSException& other);
        PSException(PSException&& other) noexcept;
        PSException& operator=(PSException&& other) noexcept;

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


extern "C" {
#endif


#ifdef __cplusplus
}
#endif
