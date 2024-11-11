#include "Channel.h"

namespace articles = native::models::articles;

articles::PSChannelModel::PSChannelModel() = default;

articles::PSChannelModel::PSChannelModel(const std::string&& name): Name(name)
{
}
