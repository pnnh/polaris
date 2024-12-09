cmake_minimum_required(VERSION 3.10)

set(PROJECT_NAME "QuantumIOS")
project(${PROJECT_NAME} LANGUAGES C CXX)

add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/../src" "${CMAKE_CURRENT_BINARY_DIR}/lib")
