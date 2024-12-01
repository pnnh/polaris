
set(EXAMPLE_NAME ${LIB_TELESCOPE}Tests)

file(GLOB_RECURSE EXAMPLE_SOURCES
        files/*.cpp)

add_executable(${EXAMPLE_NAME}
        main.cpp
        cases.cpp
        cases.h
        ${EXAMPLE_SOURCES})

add_dependencies(${EXAMPLE_NAME} ${LIB_QUANTUM} ${LIB_TELESCOPE})
target_link_libraries(${EXAMPLE_NAME} PRIVATE ${LIB_QUANTUM} ${LIB_TELESCOPE})

add_test(NAME ${EXAMPLE_NAME}HelloWorld COMMAND ${EXAMPLE_NAME} --caseName TestHelloWorld)
set_tests_properties(${EXAMPLE_NAME}HelloWorld PROPERTIES ENVIRONMENT DSN=xyz)
add_test(NAME ${EXAMPLE_NAME}SelectFiles COMMAND ${EXAMPLE_NAME} TestSelectFiles)