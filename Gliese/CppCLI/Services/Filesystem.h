#pragma once

#include <string>
#include <vector>

using namespace System;
using namespace System::Collections::Generic;

namespace Gliese
{

	public ref class GSFileModel
	{
	public:
		GSFileModel();
		GSFileModel(const GSFileModel% other);

		String^ URN;
		String^ Name;
	};

	public ref class GSFilesystemService
	{
	public:

		List<GSFileModel^>^ selectFiles();

	};

}

