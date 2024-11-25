#pragma once

namespace calieo::telescope
{
    enum Codes { Ok = 200, Error = 500 };

    const char * CodeMessage(int code);
}