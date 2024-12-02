#include "logger.h"

#include <iostream>
#include <iostream>

#ifdef WIN32
#include <hstring.h>
#include <tchar.h>
#endif


void quantum::Logger::LogInfo(const std::string& message)
{
    std::cout << "[INFO] " << message << std::endl;
}

void quantum::Logger::LogInfo(std::initializer_list<std::string> messageList)
{
#ifdef WIN32
    OutputDebugString(_T("My output string."));
#endif


    std::string fullMessage;
    for (const std::string& item : messageList)
    {
        fullMessage += " " + item;
    }
    std::cout << "[INFO] " << fullMessage << std::endl;
}
