
#include "Codes.h"

const char* calieo::telescope::CodeMessage(int code)
{
  switch (code)
  {
  case calieo::telescope::Codes::Ok:
    return "Ok";
  case calieo::telescope::Codes::Error:
    return "Error";
  default:
    return "Unknown";
  }
}
