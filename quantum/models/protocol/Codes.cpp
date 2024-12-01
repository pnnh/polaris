
#include "Codes.h"

const char* quantum::CodeMessage(int code)
{
  switch (code)
  {
  case quantum::Codes::Ok:
    return "Ok";
  case quantum::Codes::Error:
    return "Error";
  default:
    return "Unknown";
  }
}
