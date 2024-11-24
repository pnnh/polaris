#pragma once

#include <type_traits>

namespace quantum
{
    class EnumUtils
    {
    public:
        template <typename E>
        static constexpr typename std::underlying_type<E>::type ToUnderlying(E e) noexcept;
    };
}
