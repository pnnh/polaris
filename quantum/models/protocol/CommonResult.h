#pragma once

#include <string>
#include <stdint.h>

namespace quantum
{
    class CommonResult {
    public:
        CommonResult(int code, std::string message) : code(code), message(std::move(message)) {}

        int getCode() const {
            return code;
        }

        void setCode(int code) {
            CommonResult::code = code;
        }

        const std::string &getMessage() const {
            return message;
        }

        void setMessage(const std::string &message) {
            CommonResult::message = message;
        }

    private:
        uint16_t code;
        std::string message;
    };
}