#pragma once

#include "Class.g.h"

namespace winrt::CppWinRTComponent::implementation
{
    struct Class : ClassT<Class>
    {
        Class() = default;

        int32_t Add(int32_t a, int32_t b);
    };
}

namespace winrt::CppWinRTComponent::factory_implementation
{
    struct Class : ClassT<Class, implementation::Class>
    {
    };
}
