
#=========================WASM BROWSER==========================#
set(WASM_BROWSER ${CALIEO_NAME}WasmBrowser)

add_executable(${WASM_BROWSER}
        wasm/browser/main.cpp
        wasm/wasm.cpp
        wasm/wasm.h
)

add_dependencies(${WASM_BROWSER} ${LIB_QUANTUM} ${LIB_TELESCOPE})
target_link_libraries(${WASM_BROWSER} PRIVATE ${LIB_QUANTUM} ${LIB_TELESCOPE})

set_target_properties(${WASM_BROWSER} PROPERTIES LINK_FLAGS "-lembind -sMODULARIZE -sENVIRONMENT=web -sTOTAL_MEMORY=32MB --emit-tsd ${WASM_BROWSER}.d.ts")

file(COPY_FILE ${CMAKE_CURRENT_SOURCE_DIR}/package.json ${CMAKE_CURRENT_BINARY_DIR}/package.json)

install(FILES
        "$<TARGET_FILE_DIR:${WASM_BROWSER}>/${WASM_BROWSER}.js"
        "$<TARGET_FILE_DIR:${WASM_BROWSER}>/${WASM_BROWSER}.wasm"
        "$<TARGET_FILE_DIR:${WASM_BROWSER}>/${WASM_BROWSER}.d.ts"
        "$<TARGET_FILE_DIR:${WASM_BROWSER}>/package.json"
        DESTINATION browser)


#========================WASM SERVER===========================#
set(WASM_SERVER ${CALIEO_NAME}WasmServer)

add_executable(${WASM_SERVER}
        wasm/server/main.cpp
        wasm/wasm.cpp
        wasm/wasm.h
)

add_dependencies(${WASM_SERVER} ${LIB_QUANTUM} ${LIB_TELESCOPE})
target_link_libraries(${WASM_SERVER} PRIVATE ${LIB_QUANTUM} ${LIB_TELESCOPE})

set_target_properties(${WASM_SERVER} PROPERTIES LINK_FLAGS "-lembind -sMODULARIZE -sTOTAL_MEMORY=32MB --emit-tsd ${WASM_SERVER}.d.ts")

file(COPY_FILE ${CMAKE_CURRENT_SOURCE_DIR}/package.json ${CMAKE_CURRENT_BINARY_DIR}/package.json)

install(FILES
        "$<TARGET_FILE_DIR:${WASM_SERVER}>/${WASM_SERVER}.js"
        "$<TARGET_FILE_DIR:${WASM_SERVER}>/${WASM_SERVER}.wasm"
        "$<TARGET_FILE_DIR:${WASM_SERVER}>/${WASM_SERVER}.d.ts"
        "$<TARGET_FILE_DIR:${WASM_SERVER}>/package.json"
        DESTINATION server)

