#!/bin/bash

curl -kOL https://github.com/WebAssembly/wabt/archive/refs/tags/1.0.30.tar.gz
tar zxvf 1.0.30.tar.gz -C ./deps
mv ./deps/wabt-1.0.30 ./deps/wabt
patch -p0 < ./cmake.patch
