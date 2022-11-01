#!/bin/bash

rm -rf ./build

mkdir -p ./build

cmake -DCMAKE_TOOLCHAIN_FILE=$WASI_SDK_PATH/share/cmake/wasi-sdk.cmake \
      -DWASI_SDK_PREFIX=$WASI_SDK_PATH \
      -DCMAKE_VERBOSE_MAKEFILE=OFF \
      -DCMAKE_BUILD_TYPE=Release \
      -H. -Bbuild

cmake --build build

mkdir -p ./bin
cp -rpf ./build/deps/wabt/*.wasm ./bin
