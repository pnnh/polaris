
#include "Helper.h"

#pragma managed(push, off)
#include <iostream>

void helper::Helper::Write(const char* message)
{
	std::cout << "Message from CppCLI: " << message << std::endl;
}

#pragma managed(pop)