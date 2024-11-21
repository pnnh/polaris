#include <filesystem>
#include "mime.h"

#include <base/types/StringUtils.h>

bool polaris::base::MimeUtils::isImage(const std::string& path)
{
    const auto stdPath = std::filesystem::path(path);
    auto ext = stdPath.extension().string();
    ext = StringUtils::toLower(ext);
    if (ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif" || ext == ".webp")
        return true;
    return false;
}

bool polaris::base::MimeUtils::isHidden(const std::string& path)
{
    if (path.rfind('.', 0) == 0)
    {
        return true;
    }
    return false;
}

// 一般不处理这些特殊的路径下面的文件
bool polaris::base::MimeUtils::isIgnore(const std::string& path)
{
    if (isHidden(path) || path.find("node_modules") != std::string::npos || path.find("build") != std::string::npos)
    {
        return true;
    }
    return false;
}

std::string polaris::base::MimeUtils::getMimeType(const std::string& path)
{
    const auto stdPath = std::filesystem::path(path);
    auto ext = stdPath.extension().string();
    ext = StringUtils::toLower(ext);

    if (ext == ".txt")
        return "text/plain";
    if (ext == ".htm" || ext == ".html")
        return "text/html";
    if (ext == ".js")
        return "application/javascript";
    if (ext == ".css")
        return "text/css";
    if (ext == ".jpg" || ext == ".jpeg")
        return "image/jpeg";
    if (ext == ".png")
        return "image/png";
    if (ext == ".json")
        return "application/json";
    if (ext == ".gif")
        return "image/gif";
    if (ext == ".webp")
        return "application/webp";

    return "application/octet-stream";
}
