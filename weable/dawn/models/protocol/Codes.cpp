
#include "Codes.h"

const char* weable::dawn::CodeMessage(int code)
{
  switch (code)
  {
  case weable::dawn::Codes::Ok:
    return "Ok";
  case weable::dawn::Codes::Error:
    return "Error";
  default:
    return "Unknown";
  }
}
