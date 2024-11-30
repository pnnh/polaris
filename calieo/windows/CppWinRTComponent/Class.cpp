#include "pch.h"
#include "Class.h"
#if __has_include("Class.g.cpp")
#include "Class.g.cpp"
#endif

// To learn more about WinUI, the WinUI project structure,
// and more about our project templates, see: http://aka.ms/winui-project-info.

namespace winrt::CppWinRTComponent::implementation
{
    int32_t Class::Add(int32_t a, int32_t b)
    {
        return a + b;
    }
}
