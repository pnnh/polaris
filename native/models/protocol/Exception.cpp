#include "Exception.h"

native::QuantumException::QuantumException() : _codeEnum(QuantumEnum::ERROR)
{
}

native::QuantumException::QuantumException(const std::string& exceptionMessage) : _codeEnum(QuantumEnum::ERROR),
    _exceptionMessage(exceptionMessage)
{
}

native::QuantumException::QuantumException(const char* firstMessage, const char* secondMessage) :
    _codeEnum(QuantumEnum::ERROR),
    _exceptionMessage(firstMessage)
{
    _exceptionMessage = _exceptionMessage.value_or("") + secondMessage;
}

native::QuantumException::QuantumException(const QuantumException& other) : exception(other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
}

native::QuantumException& native::QuantumException::operator=(const QuantumException& other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
    return *this;
}

native::QuantumException::QuantumException(QuantumException&& other) noexcept : exception(other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
}

native::QuantumException& native::QuantumException::operator=(QuantumException&& other) noexcept
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
    return *this;
}

native::QuantumException::QuantumException(QuantumEnum error, std::string exceptionMessage) : _codeEnum(error),
    _exceptionMessage(exceptionMessage)
{
}

void native::QuantumException::AppendMessage(const std::string& exceptionMessage)
{
    this->_exceptionMessage = this->_exceptionMessage.value_or("") + exceptionMessage;
}
