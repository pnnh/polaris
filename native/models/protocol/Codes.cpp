
#include "Codes.h"

const char *CodeMessage(int code) {
  switch (code) {
    case Codes::Ok:
      return "Ok";
    case Codes::Error:
      return "Error";
    default:
      return "Unknown";
  }
}
