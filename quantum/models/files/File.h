#pragma once

#include "build.h"

#ifdef __cplusplus
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
    MTAPI int list_file(int input);

#ifdef __cplusplus
}
#endif