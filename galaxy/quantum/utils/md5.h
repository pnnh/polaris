#pragma once

#include <string>
#include <boost/uuid/detail/md5.hpp>
#include <boost/algorithm/hex.hpp>

using boost::uuids::detail::md5;

namespace quantum
{
    std::string toString(const md5::digest_type& digest);

    std::string calcMd5(const std::string& content);
}
