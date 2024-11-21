
#include "Codes.h"

const char* polaris::native::CodeMessage(int code)
{
  switch (code)
  {
  case polaris::native::Codes::Ok:
    return "Ok";
  case polaris::native::Codes::Error:
    return "Error";
  default:
    return "Unknown";
  }
}
