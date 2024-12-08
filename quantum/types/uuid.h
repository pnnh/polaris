#pragma once

#include <regex>
#include <string>
#include "quantum/build.h"

#ifdef __cplusplus

namespace quantum {

    class MTAPI_EXPORT MTUuid
    {
    public:
        static bool isUUID(const std::string &uuid_string);

    private:
        static std::regex uuid_regex;
    };

}

extern "C" {
#endif


#ifdef __cplusplus
}
#endif
