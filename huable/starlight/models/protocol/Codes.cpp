
#include "Codes.h"

const char* huable::starlight::CodeMessage(int code)
{
  switch (code)
  {
  case huable::starlight::Codes::Ok:
    return "Ok";
  case huable::starlight::Codes::Error:
    return "Error";
  default:
    return "Unknown";
  }
}
