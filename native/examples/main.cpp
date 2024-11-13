#include <iostream>

#include <boost/program_options/option.hpp>
#include <boost/program_options/parsers.hpp>
#include <boost/program_options/variables_map.hpp>
#include <boost/program_options/options_description.hpp>
#include <filesystem>

#include "cases.h"

namespace program_options = boost::program_options;

int main(int argc, char* argv[])
{
    std::string caseName;

    program_options::options_description desc("Allowed options");
    desc.add_options()
        ("help", "produce help message")
        ("caseName", program_options::value<std::string>(&caseName), "case name");

    program_options::variables_map vm;
    program_options::store(program_options::parse_command_line(argc, argv, desc), vm);
    program_options::notify(vm);

    if (vm.contains("help"))
    {
        std::cout << desc << "\n";
        return 1;
    }

    std::cout << "selected case: " << caseName << " " << caseName << std::endl;
    std::cout << "current path: " << std::filesystem::current_path() << std::endl;

    native::examples::runCase(caseName);
}
