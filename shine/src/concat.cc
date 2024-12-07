#include "shine/include/concat.h"

rust::String concat(ConcatRequest r) {
  // The full suite of operator overloads hasn't been added
  // yet on rust::String, but we can get it done like this:
  return std::string(r.fst) + std::string(r.snd);
}