
#include "md5.h"
#include <iterator>
#include <boost/uuid/detail/md5.hpp>
#include <boost/algorithm/hex.hpp>

std::string quantum::calcMd5(const std::string& content)
{
    md5 hash;
    md5::digest_type digest;
    hash.process_bytes(content.data(), content.size());
    hash.get_digest(digest);
    const auto intDigest = reinterpret_cast<const int*>(&digest);
    std::string result;
    boost::algorithm::hex(intDigest, intDigest + (sizeof(md5::digest_type) / sizeof(int)), std::back_inserter(result));
    return result;
}

std::string quantum::toString(const md5::digest_type& digest)
{
    const auto charDigest = reinterpret_cast<const char*>(&digest);
    std::string result;
    boost::algorithm::hex(charDigest, charDigest + sizeof(md5::digest_type), std::back_inserter(result));
    return result;
}
