#include "pch.h"

#include "CppCLI.h"
#include <iostream>
#include "Helper.h"


using namespace System;

void CppCLI::Logger::Info(String^ message)
{
	Console::WriteLine(message);
	std::wcout << L"Hello from C++" << std::endl;

	helper::Helper::Write("Hello from Helper");
}
