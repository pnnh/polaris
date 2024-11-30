
#include "Helper.h"

#pragma managed(push, off)
#include <iostream>

int helper::Helper::Write(const char* message)
{
	std::cout << "Message from CppCLI: " << message << std::endl;
	return 999;
}

#pragma managed(pop)