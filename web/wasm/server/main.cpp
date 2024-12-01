#include "web/wasm/wasm.h"
#include <iostream>

int main(int argc, char* argv[])
{
    auto abc = lerp(2.4, 4.3, 0.5);
    std::cout << "server::lerp(2.4, 4.3, 0.5) = " << abc << std::endl;
}
