Build [wabt](https://github.com/WebAssembly/wabt) to `wasm32-wasi` with [wasi-sdk](https://github.com/WebAssembly/wasi-sdk),
and **run in browser**!

Prerequest:

- WSL 2 / Linux / macOS
- CMake
- wasi-sdk
- Node.js / npm

```bash
export WASI_SDK_PATH=/opt/wasi-sdk
```

```bash
git clone https://github.com/toyobayashi/wasi-wabt
cd wasi-wabt

chmod +x ./fetch.sh
chmod +x ./build.sh
./fetch.sh
./build.sh

npm install
npm start
```
