
set(LIB_WASM ${PROJECT_NAME}WasmCommon)
set(WASM_SERVER ${PROJECT_NAME}WasmServer)

add_executable(${WASM_SERVER}
        main.cpp
)

target_link_libraries(${WASM_SERVER} ${LIB_WASM})
set_target_properties(${WASM_SERVER} PROPERTIES LINK_FLAGS "-lembind -sMODULARIZE -sTOTAL_MEMORY=32MB --embind-emit-tsd ${WASM_SERVER}.d.ts")

file(COPY_FILE ${CMAKE_CURRENT_SOURCE_DIR}/package.json ${CMAKE_CURRENT_BINARY_DIR}/package.json)

install(FILES
        "$<TARGET_FILE_DIR:${WASM_SERVER}>/${WASM_SERVER}.js"
        "$<TARGET_FILE_DIR:${WASM_SERVER}>/${WASM_SERVER}.wasm"
        "$<TARGET_FILE_DIR:${WASM_SERVER}>/${WASM_SERVER}.d.ts"
        "$<TARGET_FILE_DIR:${WASM_SERVER}>/package.json"
        DESTINATION server)