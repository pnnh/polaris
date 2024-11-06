#pragma once

#include <iostream>
#include <optional>
#include <string>

namespace polaris::native::models::protocol
{
    enum class QuantumError
    {
        OK = 0,
        ERROR = 1
    };

    constexpr const char* QuantumErrorToString(QuantumError error)
    {
        switch (error)
        {
        case QuantumError::OK:
            return "OK";
        case QuantumError::ERROR:
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
        QuantumException(QuantumError error, std::string message);
        QuantumException(const char* firstMessage, const char* secondMessage);

        QuantumException(const QuantumException& other);
        QuantumException& operator=(const QuantumException& other);
        QuantumException(QuantumException&& other) noexcept;
        QuantumException& operator=(QuantumException&& other) noexcept;

        [[nodiscard]]
        const char* what() const noexcept override
        {
            std::cerr << QuantumErrorToString(error) << ": " << message.value_or("") << std::endl;
            return QuantumErrorToString(error);
        }

    private:
        QuantumError error;
        std::optional<std::string> message;
    };
}

