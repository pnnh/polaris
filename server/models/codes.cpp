//
// Created by azureuser on 4/11/23.
//

#include "server/models/codes.h"

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