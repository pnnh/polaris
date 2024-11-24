#pragma once

#include <optional>
#include <string>
#include <yaml-cpp/node/node.h>

namespace polaris::base
{
    class YamlHandler
    {
    public:
        explicit YamlHandler(const std::string& filePath);

        std::optional<std::string> getString(const std::string& keyName);

    private:
        std::string _filePath;
        YAML::Node _yamlConfig;
    };
}
