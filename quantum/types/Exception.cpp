#include "Exception.h"

quantum::PSException::PSException() : _codeEnum(QuantumEnum::ERROR)
{
}

quantum::PSException::PSException(const std::string& exceptionMessage) : _codeEnum(QuantumEnum::ERROR),
    _exceptionMessage(exceptionMessage)
{
}

quantum::PSException::PSException(const char* firstMessage, const char* secondMessage) :
    _codeEnum(QuantumEnum::ERROR),
    _exceptionMessage(firstMessage)
{
    _exceptionMessage = _exceptionMessage.value_or("") + secondMessage;
}

quantum::PSException::PSException(const PSException& other) : exception(other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
}

quantum::PSException& quantum::PSException::operator=(const PSException& other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
    return *this;
}

quantum::PSException::PSException(PSException&& other) noexcept : exception(other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
}

quantum::PSException& quantum::PSException::operator=(PSException&& other) noexcept
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
    return *this;
}

quantum::PSException::PSException(QuantumEnum error, std::string exceptionMessage) : _codeEnum(error),
    _exceptionMessage(exceptionMessage)
{
}

void quantum::PSException::AppendMessage(const std::string& exceptionMessage)
{
    this->_exceptionMessage = this->_exceptionMessage.value_or("") + exceptionMessage;
}
