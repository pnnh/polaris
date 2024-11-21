#include "yaml.h"

#include <regex>
#include <base/types/StringUtils.h>
#include <yaml-cpp/yaml.h>


std::optional<std::string> polaris::base::YamlHandler::getString(const std::string& keyName)
{
    // 多级key
    if (keyName.rfind('.', 0) > 0 && std::regex_match(keyName, std::regex(R"(^(\w+\.)+\w+$)")))
    {
        auto nameList = polaris::base::StringUtils::Split(keyName, '.');
        YAML::Node node = _yamlConfig;
        for (const auto& name : nameList)
        {
            if (node[name])
            {
                node = node[name];
            }
            else
            {
                return std::nullopt;
            }
        }
        return node.as<std::string>();
    }
    // 一级key
    if (_yamlConfig[keyName])
    {
        return _yamlConfig[keyName].as<std::string>();
    }

    return std::nullopt;
}

polaris::base::YamlHandler::YamlHandler(const std::string& filePath)
{
    this->_yamlConfig = YAML::LoadFile(filePath);
}
