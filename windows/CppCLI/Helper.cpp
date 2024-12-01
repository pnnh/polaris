
#include "Helper.h"

#pragma managed(push, off)
#include <iostream>
#include "quantum/services/logger/logger.h"

int helper::Helper::Write(const char* message)
{
	std::cout << "Message from CppCLI: " << message << std::endl;
	quantum::Logger::LogInfo("Hello啊哈哈哈");
	return 999;
}

#pragma managed(pop)