#include "quantum/utils/uuid.h"

std::regex polaris::base::UUIDHelper::uuid_regex = std::regex(
    "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");

bool polaris::base::UUIDHelper::isUUID(const std::string& uuid_string)
{
    std::smatch match;

    if (std::regex_match(uuid_string, match, uuid_regex) &&
        uuid_string.length() == 36)
    {
        return true;
    }

    return false;
}
