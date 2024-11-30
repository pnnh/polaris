#include "pch.h"

#include "CppCLI.h"
#include <iostream>
#include "Helper.h"


using namespace System;

int CppCLI::Logger::Info(String^ message)
{
	Console::WriteLine(message);
	std::wcout << L"Hello from C++" << std::endl;

	auto result = helper::Helper::Write("Hello from Helper");

	return result * 10;
}
