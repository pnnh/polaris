#include "datetime.h"

#include <boost/date_time.hpp>
#include <boost/date_time/posix_time/posix_time.hpp>
#include <ctime>
#include <sstream>

std::string WString2String(const std::wstring& wstr)
{
    setlocale(LC_ALL, "en_US.UTF-8");
    const wchar_t* wchSrc = wstr.c_str();
    size_t nWStr = wcstombs(NULL, wchSrc, 0) + 1;
    char* chDest = new char[nWStr];
    memset(chDest, 0, nWStr);
    wcstombs(chDest, wchSrc, nWStr);
    std::string strRes = chDest;
    delete[] chDest;

    return strRes;
}

std::wstring String2WString(const std::string& str)
{
    std::string strUtf8 = str;
    setlocale(LC_ALL, "en_US.UTF-8");
    const char* chSrc = strUtf8.c_str();
    size_t nStr = mbstowcs(NULL, chSrc, 0) + 1;
    wchar_t* wchDest = new wchar_t[nStr];
    memset(wchDest, 0, nStr);
    mbstowcs(wchDest, chSrc, nStr);
    std::wstring wStrRes = wchDest;
    delete[] wchDest;
    return wStrRes;
}

std::chrono::system_clock::time_point ParseDate(const std::wstring& dateText, const wchar_t* const format)
{
    boost::posix_time::ptime time;
    std::wstringstream buffer(dateText);
    buffer.imbue(std::locale(std::locale::classic(), new boost::posix_time::wtime_input_facet(format)));
    buffer >> time;
    auto timeInfo = to_tm(time);
    auto result = std::chrono::system_clock::from_time_t(std::mktime(&timeInfo));
    return result;
}

std::chrono::system_clock::time_point quantum::makeTimePoint(const std::string& time_string)
{
    // using namespace boost::posix_time;
    // using namespace std::chrono;

    // const ptime ts = from_iso_string(s);
    // auto seconds = to_time_t(ts);
    // time_duration td = ts.time_of_day();
    // auto microseconds = td.fractional_seconds();
    // auto d = std::chrono::seconds{seconds} + std::chrono::microseconds{microseconds};
    // system_clock::time_point tp{duration_cast<system_clock::duration>(d)};
    // return tp;

    auto timePoint = ParseDate(String2WString(time_string), L"%Y-%m-%d %H:%M:%S%Q%ZP");
    // auto time = std::chrono::system_clock::to_time_t(timePoint);
    return timePoint;
}

std::string quantum::formatTime(const std::chrono::system_clock::time_point& time_point)
{
    std::time_t now = std::chrono::system_clock::to_time_t(time_point);

    char mbstr[100];
    std::strftime(mbstr, sizeof(mbstr), "%FT%TZ", std::localtime(&now));
    return mbstr;
}


quantum::PSDatetime::PSDatetime(): timeValue()
{
}

quantum::PSDatetime::PSDatetime(const std::string& datetime)
{
    this->timeValue = makeTimePoint(datetime);
}

quantum::PSDatetime::PSDatetime(const std::chrono::system_clock::time_point& datetime)
{
    this->timeValue = datetime;
}

quantum::PSDatetime::PSDatetime(const std::time_t& datetime)
{
    this->timeValue = std::chrono::system_clock::from_time_t(datetime);
}

quantum::PSDatetime& quantum::PSDatetime::operator=(const PSDatetime& other)
= default;

quantum::PSDatetime& quantum::PSDatetime::operator=(const std::chrono::system_clock::time_point& tp)
{
    this->timeValue = tp;
    return *this;
}

quantum::PSDatetime& quantum::PSDatetime::operator=(const std::time_t& time)
{
    this->timeValue = std::chrono::system_clock::from_time_t(time);
    return *this;
}

std::string quantum::PSDatetime::toString() const
{
    return formatTime(this->timeValue);
}
