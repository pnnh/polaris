#include "File.h"

quantum::PSFileModel::PSFileModel(std::string title)
{
    this->Title = title;
    this->CreateTime = std::chrono::system_clock::now();
    this->UpdateTime = std::chrono::system_clock::now();
}

PSFileStruct* NewPSFileStruct() {
    return new PSFileStruct();
}

void DeletePSFileStruct(PSFileStruct* file) {
    delete file;
}

int list_file(int input) {
    printf("input2: %d\n", input);

    return input * 2;
}