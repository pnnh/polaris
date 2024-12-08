#pragma once
#include <string>
#include <chrono>
#include "quantum/types/datetime.h"
#include "quantum/build.h"

#ifdef __cplusplus

namespace quantum
{
    class PSFileModel
    {
    public:
        explicit PSFileModel(std::string title);

        std::string URN;
        std::string Title;
        std::string Name;
        std::string Keywords;
        std::string Description;
        bool IsDir{};
        bool IsHidden{};
        bool IsIgnore{};
        PSDatetime CreateTime;
        PSDatetime UpdateTime;
    };
}

extern "C" {
#endif

    struct PSFileStruct
    {
        char* URN{};
        char* Title{};
        char* Name{};
        char* Keywords{};
        char* Description{};
        bool IsDir{};
        bool IsHidden{};
        bool IsIgnore{};
    };

    PSFileStruct* NewPSFileStruct();
    void DeletePSFileStruct(PSFileStruct* file);
    MTAPI_EXPORT int list_file(int input);

#ifdef __cplusplus
}
#endif

