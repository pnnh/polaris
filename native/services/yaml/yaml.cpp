#include "yaml.h"

#include <regex>
#include <yaml-cpp/yaml.h>

#include "native/utils/StringUtils.h"

std::optional<std::string> native::services::yaml::YamlHandler::getString(const std::string& keyName)
{
    // 多级key
    if (keyName.rfind('.', 0) > 0 && std::regex_match(keyName, std::regex(R"(^(\w+\.)+\w+$)")))
    {
        auto nameList = native::StringUtils::Split(keyName, '.');
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

native::services::yaml::YamlHandler::YamlHandler(const std::string& filePath)
{
    this->_yamlConfig = YAML::LoadFile(filePath);
}
