#include "Exception.h"

polaris::base::QuantumException::QuantumException() : _codeEnum(QuantumEnum::ERROR)
{
}

polaris::base::QuantumException::QuantumException(const std::string& exceptionMessage) : _codeEnum(QuantumEnum::ERROR),
    _exceptionMessage(exceptionMessage)
{
}

polaris::base::QuantumException::QuantumException(const char* firstMessage, const char* secondMessage) :
    _codeEnum(QuantumEnum::ERROR),
    _exceptionMessage(firstMessage)
{
    _exceptionMessage = _exceptionMessage.value_or("") + secondMessage;
}

polaris::base::QuantumException::QuantumException(const QuantumException& other) : exception(other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
}

polaris::base::QuantumException& polaris::base::QuantumException::operator=(const QuantumException& other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
    return *this;
}

polaris::base::QuantumException::QuantumException(QuantumException&& other) noexcept : exception(other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
}

polaris::base::QuantumException& polaris::base::QuantumException::operator=(QuantumException&& other) noexcept
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
    return *this;
}

polaris::base::QuantumException::QuantumException(QuantumEnum error, std::string exceptionMessage) : _codeEnum(error),
    _exceptionMessage(exceptionMessage)
{
}

void polaris::base::QuantumException::AppendMessage(const std::string& exceptionMessage)
{
    this->_exceptionMessage = this->_exceptionMessage.value_or("") + exceptionMessage;
}
