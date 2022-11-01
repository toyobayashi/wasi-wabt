cmake_minimum_required(VERSION 3.13)

project(wasiwabt)

# set(CMAKE_C_COMPILER_WORKS ON)
# set(CMAKE_CXX_COMPILER_WORKS ON)

add_link_options(
  "-Wl,--initial-memory=16777216"
)

if(CMAKE_BUILD_TYPE STREQUAL "Release")
  # https://github.com/WebAssembly/wasi-sdk/issues/254
  add_link_options("-Wl,--strip-debug")
endif()

set(BUILD_TESTS OFF)
set(BUILD_LIBWASM OFF)

add_subdirectory(deps/wabt)
