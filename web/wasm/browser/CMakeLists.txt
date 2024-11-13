set(LIB_WASM ${PROJECT_NAME}WasmCommon)
set(WASM_BROWSER ${PROJECT_NAME}WasmBrowser)

add_executable(${WASM_BROWSER}
        main.cpp
)

target_link_libraries(${WASM_BROWSER} ${LIB_WASM})

set_target_properties(${WASM_BROWSER} PROPERTIES LINK_FLAGS "-lembind -sMODULARIZE -sENVIRONMENT=web -sTOTAL_MEMORY=32MB --embind-emit-tsd ${WASM_BROWSER}.d.ts")

file(COPY_FILE ${CMAKE_CURRENT_SOURCE_DIR}/package.json ${CMAKE_CURRENT_BINARY_DIR}/package.json)

install(FILES
        "$<TARGET_FILE_DIR:${WASM_BROWSER}>/${WASM_BROWSER}.js"
        "$<TARGET_FILE_DIR:${WASM_BROWSER}>/${WASM_BROWSER}.wasm"
        "$<TARGET_FILE_DIR:${WASM_BROWSER}>/${WASM_BROWSER}.d.ts"
        "$<TARGET_FILE_DIR:${WASM_BROWSER}>/package.json"
        DESTINATION browser)