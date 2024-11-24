
set(LIB_QUANTUM Quantum CACHE INTERNAL "LIB_QUANTUM")

file(GLOB_RECURSE LIB_SOURCES
        types/*.cpp
        utils/*.cpp
        services/*.cpp)

add_library(${LIB_QUANTUM} ${LIB_SOURCES})

configure_file("build.h.in" "${PROJECT_BINARY_DIR}/build.h")

# 查找并引用Boost库
find_package(Boost COMPONENTS system thread chrono filesystem url program_options REQUIRED)
target_include_directories(${LIB_QUANTUM} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${LIB_QUANTUM} PRIVATE ${Boost_LIBRARIES})

install(TARGETS ${LIB_QUANTUM}
        BUNDLE DESTINATION .
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})