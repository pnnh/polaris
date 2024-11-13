
set(LIB_WASM ${PROJECT_NAME}WebAssembly)
set(WASM_NODEJS ${PROJECT_NAME}WasmNodejs)

add_executable(${WASM_NODEJS}
        main.cpp
)

target_link_libraries(${WASM_NODEJS} ${LIB_WASM})
set_target_properties(${WASM_NODEJS} PROPERTIES LINK_FLAGS "-lembind -sMODULARIZE -sTOTAL_MEMORY=32MB --embind-emit-tsd ${WASM_NODEJS}.d.ts")

file(COPY_FILE ${CMAKE_CURRENT_SOURCE_DIR}/package.json ${CMAKE_CURRENT_BINARY_DIR}/package.json)

install(FILES
        "$<TARGET_FILE_DIR:${WASM_NODEJS}>/${WASM_NODEJS}.js"
        "$<TARGET_FILE_DIR:${WASM_NODEJS}>/${WASM_NODEJS}.wasm"
        "$<TARGET_FILE_DIR:${WASM_NODEJS}>/${WASM_NODEJS}.d.ts"
        "$<TARGET_FILE_DIR:${WASM_NODEJS}>/package.json"
        DESTINATION server)