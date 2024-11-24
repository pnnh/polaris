#include "Exception.h"

polaris::base::PSException::PSException() : _codeEnum(QuantumEnum::ERROR)
{
}

polaris::base::PSException::PSException(const std::string& exceptionMessage) : _codeEnum(QuantumEnum::ERROR),
    _exceptionMessage(exceptionMessage)
{
}

polaris::base::PSException::PSException(const char* firstMessage, const char* secondMessage) :
    _codeEnum(QuantumEnum::ERROR),
    _exceptionMessage(firstMessage)
{
    _exceptionMessage = _exceptionMessage.value_or("") + secondMessage;
}

polaris::base::PSException::PSException(const PSException& other) : exception(other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
}

polaris::base::PSException& polaris::base::PSException::operator=(const PSException& other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
    return *this;
}

polaris::base::PSException::PSException(PSException&& other) noexcept : exception(other)
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
}

polaris::base::PSException& polaris::base::PSException::operator=(PSException&& other) noexcept
{
    _codeEnum = other._codeEnum;
    _exceptionMessage = other._exceptionMessage;
    return *this;
}

polaris::base::PSException::PSException(QuantumEnum error, std::string exceptionMessage) : _codeEnum(error),
    _exceptionMessage(exceptionMessage)
{
}

void polaris::base::PSException::AppendMessage(const std::string& exceptionMessage)
{
    this->_exceptionMessage = this->_exceptionMessage.value_or("") + exceptionMessage;
}
