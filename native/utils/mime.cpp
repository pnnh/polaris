#include <filesystem>
#include "mime.h"

#include "StringUtils.h"

bool native::utils::MimeUtils::isImage(const std::string& path)
{
    auto stdPath = std::filesystem::path(path);
    auto ext = stdPath.extension().string();
    ext = StringUtils::toLower(ext);
    if (ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif" || ext == ".webp")
        return true;
    return false;
}

bool native::utils::MimeUtils::isHidden(const std::string& path)
{
    if (path.rfind('.', 0) == 0)
    {
        return true;
    }
    return false;
}

// 一般不处理这些特殊的路径下面的文件
bool native::utils::MimeUtils::isIgnore(const std::string& path)
{
    if (isHidden(path) || path.find("node_modules") != std::string::npos || path.find("build") != std::string::npos)
    {
        return true;
    }
    return false;
}
