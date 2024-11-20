#include "Exception.h"

namespace protocol = native::models::protocol;

protocol::QuantumException::QuantumException() : error(QuantumError::ERROR), message()
{
}

protocol::QuantumException::QuantumException(const std::string &message) : error(QuantumError::ERROR),
                                                                           message(message)
{
}

protocol::QuantumException::QuantumException(const char *firstMessage, const char *secondMessage) : error(QuantumError::ERROR),
                                                                                                    message(firstMessage)
{
    message = message.value_or("") + secondMessage;
}

protocol::QuantumException::QuantumException(const QuantumException &other) : exception(other)
{
    error = other.error;
    message = other.message;
}

protocol::QuantumException &protocol::QuantumException::operator=(const QuantumException &other)
{
    error = other.error;
    message = other.message;
    return *this;
}

protocol::QuantumException::QuantumException(QuantumException &&other) noexcept : exception(other)
{
    error = other.error;
    message = other.message;
}

protocol::QuantumException &protocol::QuantumException::operator=(QuantumException &&other) noexcept
{
    error = other.error;
    message = other.message;
    return *this;
}

protocol::QuantumException::QuantumException(QuantumError error, std::string message) : error(error),
                                                                                        message(message)
{
}

void protocol::QuantumException::AppendMessage(const std::string &message)
{
    this->message = this->message.value_or("") + message;
}