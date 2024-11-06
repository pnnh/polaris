#include <iostream>

#include "cases/cases.h"
#include <boost/program_options/option.hpp>
#include <boost/program_options/parsers.hpp>
#include <boost/program_options/variables_map.hpp>
#include <boost/program_options/options_description.hpp>

namespace program_options = boost::program_options;

int main(int argc, char* argv[])
{
    unsigned int caseId = 0;
    std::string caseName;

    program_options::options_description desc("Allowed options");
    desc.add_options()
        ("help", "produce help message")
        ("caseId", program_options::value<unsigned int>(&caseId), "case id")
        ("caseName", program_options::value<std::string>(&caseName), "case name");

    program_options::variables_map vm;
    program_options::store(program_options::parse_command_line(argc, argv, desc), vm);
    program_options::notify(vm);

    if (vm.contains("help"))
    {
        std::cout << desc << "\n";
        return 1;
    }

    std::cout << "selected case: " << caseId << " " << caseName << std::endl;

    switch (caseId)
    {
    case 1:
        return polaris::native::examples::TestSqliteVersion();
    case 2:
        return polaris::native::examples::TestSqliteSelect();
    default:
        return polaris::native::examples::TestHelloWorld();
    }
}
