
set(EXAMPLE_NAME ${PROJECT_NAME}Example)
set(EXAMPLE_MODULE ${PROJECT_NAME}ExampleModule)

add_library(${EXAMPLE_MODULE})
target_sources(${EXAMPLE_MODULE} PUBLIC FILE_SET CXX_MODULES FILES foo.cppm)

add_executable(${EXAMPLE_NAME}
        main.cppm
        cases.cpp
        cases.h
        sqlite/sqlite.cpp
        sqlite/sqlite.h
        articles/channel.cpp
        articles/channel.h
        articles/article.cpp
        articles/article.h
        articles/library.cpp
        articles/library.h
        articles/notebook.cpp
        articles/notebook.h)

add_dependencies(${EXAMPLE_NAME} ${PROJECT_NAME})
target_link_libraries(${EXAMPLE_NAME} PRIVATE ${EXAMPLE_MODULE} ${PROJECT_NAME})

# 查找并引用Boost库
find_package(Boost COMPONENTS program_options REQUIRED)
target_include_directories(${EXAMPLE_NAME} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${EXAMPLE_NAME} PRIVATE ${Boost_LIBRARIES})

add_test(NAME ${EXAMPLE_NAME}HelloWorld COMMAND ${EXAMPLE_NAME} --caseName TestHelloWorld)
set_tests_properties(${EXAMPLE_NAME}HelloWorld PROPERTIES ENVIRONMENT DSN=xyz)

