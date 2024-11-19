
set(EXAMPLE_NAME ${PROJECT_NAME}Example)

file(GLOB_RECURSE EXAMPLE_SOURCES
        sqlite/*.cpp
        articles/*.cpp
        files/*.cpp)

add_executable(${EXAMPLE_NAME}
        main.cpp
        cases.cpp
        cases.h
        ${EXAMPLE_SOURCES})

add_dependencies(${EXAMPLE_NAME} ${PROJECT_NAME})
target_link_libraries(${EXAMPLE_NAME} PRIVATE ${PROJECT_NAME})

# 查找并引用Boost库
find_package(Boost COMPONENTS program_options REQUIRED)
target_include_directories(${EXAMPLE_NAME} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${EXAMPLE_NAME} PRIVATE ${Boost_LIBRARIES})

add_test(NAME ${EXAMPLE_NAME}HelloWorld COMMAND ${EXAMPLE_NAME} --caseName TestHelloWorld)
set_tests_properties(${EXAMPLE_NAME}HelloWorld PROPERTIES ENVIRONMENT DSN=xyz)
add_test(NAME ${EXAMPLE_NAME}SqliteVersion COMMAND ${EXAMPLE_NAME} --caseName TestSqliteVersion)
add_test(NAME ${EXAMPLE_NAME}SqliteSelect COMMAND ${EXAMPLE_NAME} --caseName TestSqliteSelect)
add_test(NAME ${EXAMPLE_NAME}ArticleSelectChannels COMMAND ${EXAMPLE_NAME} --caseName TestArticleSelectChannels)
add_test(NAME ${EXAMPLE_NAME}ArticleSelectArticles COMMAND ${EXAMPLE_NAME} --caseName TestArticleSelectArticles)
add_test(NAME ${EXAMPLE_NAME}ArticleSelectLibraries COMMAND ${EXAMPLE_NAME} --caseName TestArticleSelectLibraries)
add_test(NAME ${EXAMPLE_NAME}ArticleSelectNotebooks COMMAND ${EXAMPLE_NAME} --caseName TestArticleSelectNotebooks)
add_test(NAME ${EXAMPLE_NAME}SelectFiles COMMAND ${EXAMPLE_NAME} --caseName TestSelectFiles)