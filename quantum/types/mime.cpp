#include <filesystem>
#include "mime.h"

#include "quantum/types/String.h"

bool quantum::MTMime::isImage(const std::string& path)
{
    const auto stdPath = std::filesystem::path(path);
    auto ext = stdPath.extension().string();
    ext = PSString::toLower(ext);
    if (ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif" || ext == ".webp")
        return true;
    return false;
}


std::string quantum::MTMime::getMimeType(const std::string& path)
{
    const auto stdPath = std::filesystem::path(path);
    auto ext = stdPath.extension().string();
    ext = PSString::toLower(ext);

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
