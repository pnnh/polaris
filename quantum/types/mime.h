#pragma once

#include <string>
#include <quantum/build.h>

#ifdef __cplusplus

namespace quantum
{
    class MTAPI_EXPORT MTMime
    {
    public:
        static bool isImage(const std::string& path);
        static std::string getMimeType(const std::string& path);
    };
}

extern "C" {
#endif


#ifdef __cplusplus
}
#endif
