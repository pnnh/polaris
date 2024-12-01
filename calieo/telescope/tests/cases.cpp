#include <iostream>
#include "cases.h"

#include <functional>
#include <unordered_map>

//#include "sqlite/sqlite.h"
#include "files/file.h"

namespace examples = calieo::telescope::examples;
//namespace sqlite = examples::sqlite;

int calieo::telescope::examples::TestHelloWorld()
{
    std::cout << "TestHelloWorld: OK" << std::endl;
    return 0;
}

const std::unordered_map<std::string, std::function<int()>> caseMap{
    {"TestHelloWorld", examples::TestHelloWorld},
  /*  {"TestSqliteSelect", sqlite::TestSqliteSelect},
    {"TestSqliteVersion", sqlite::TestSqliteVersion},*/
    {"TestSelectFiles", examples::TestSelectFiles}};

int calieo::telescope::examples::runCase(const std::string &caseName)
{
    const auto end = caseMap.end();
    auto it = caseMap.find(caseName);
    if (it != end)
    {
        return it->second();
    }
    return -1;
}
