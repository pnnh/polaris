#pragma once

namespace polaris::native
{
    enum Codes { Ok = 200, Error = 500 };

    const char * CodeMessage(int code);
}