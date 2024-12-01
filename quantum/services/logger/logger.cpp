#include "logger.h"

#include <iostream>
#include <hstring.h>
#include <iostream>
#include <tchar.h>

void quantum::Logger::LogInfo(const std::string& message)
{
    std::cout << "[INFO] " << message << std::endl;
}

void quantum::Logger::LogInfo(std::initializer_list<std::string> messageList)
{


    OutputDebugString(_T("My output string."));


    std::string fullMessage;
    for (const std::string& item : messageList)
    {
        fullMessage += " " + item;
    }
    std::cout << "[INFO] " << fullMessage << std::endl;
}
