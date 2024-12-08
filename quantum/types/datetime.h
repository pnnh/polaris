#pragma once

#include <string>
#include <chrono>
#include <ctime>

#ifdef __cplusplus

namespace quantum
{
    std::chrono::system_clock::time_point makeTimePoint(const std::string& s);

    std::string formatTime(const std::chrono::system_clock::time_point& time_point);

    class PSDatetime
    {
    public:
        explicit PSDatetime();
        explicit PSDatetime(const std::string& datetime);
        explicit PSDatetime(const std::chrono::system_clock::time_point& datetime);
        explicit PSDatetime(const std::time_t& datetime);

        PSDatetime& operator=(const PSDatetime& other);
        PSDatetime& operator=(const std::chrono::system_clock::time_point& x);
        PSDatetime& operator=(const std::time_t& datetime);

        [ [nodiscard] ]
        std::string toString() const;
        [[nodiscard]] std::chrono::system_clock::time_point toTimePoint() const;

    private:
        std::chrono::system_clock::time_point timeValue;
    };
}




extern "C" {
#endif


#ifdef __cplusplus
}
#endif
