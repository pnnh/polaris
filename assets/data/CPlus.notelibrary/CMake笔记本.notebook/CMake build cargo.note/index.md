

```shell

message(CMAKE_BUILD_TYPE: ${CMAKE_OSX_ARCHITECTURES} ${CMAKE_BUILD_TYPE})
if (${CMAKE_BUILD_TYPE} STREQUAL "Debug")
    set(CARGO_CMD cargo build)
    set(TARGET_DIR "debug")
else ()
    set(CARGO_CMD cargo build --release)
    set(TARGET_DIR "release")
endif ()

#set(RS_SO "${CMAKE_CURRENT_BINARY_DIR}/${TARGET_DIR}/libfoo_rs.a")

add_custom_target(rs ALL
        COMMENT "Compiling rs module"
        COMMAND CARGO_TARGET_DIR=${CMAKE_CURRENT_BINARY_DIR} ${CARGO_CMD}
        #        COMMAND cp ${RS_SO} ${CMAKE_CURRENT_BINARY_DIR}
        WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/../..)

set_target_properties(rs PROPERTIES LOCATION ${CMAKE_CURRENT_BINARY_DIR})

```
