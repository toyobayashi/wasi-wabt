import { WASI } from '@tybys/wasm-util'
import { Volume, createFsFromVolume } from 'memfs-browser'

async function start (buffer, fs, args) {
  const wasi = new WASI({
    args,
    env: {},
    returnOnExit: true,
    preopens: {
      '/': '/'
    },
    // print: (text) => console.log(text),
    // printErr: (text) => console.error(text),
    fs
  })

  const { instance } = await WebAssembly.instantiate(buffer, {
    wasi_snapshot_preview1: wasi.wasiImport
  })
  console.log('%c%s', 'color: green; font-weight: bold', '$ ' + args.join(' '))
  const exitCode = wasi.start(instance)
  console.log('%c%s', 'color: blue', 'exit: ' + exitCode)
  return exitCode
}

async function main () {
  const wasmObjdumpBuffer = new Uint8Array(await (await fetch('./bin/wasm-objdump.wasm')).arrayBuffer())
  const wat2wasmBuffer = new Uint8Array(await (await fetch('./bin/wat2wasm.wasm')).arrayBuffer())

  const fs = createFsFromVolume(Volume.fromJSON({
    '/': null
  }))

  const wat =
`(module
  (func $fib (export "fib")
      (param $n i32) (result i32)
    (local $tmp i32)

    local.get $n
    i32.const 2
    i32.lt_s
    if
      local.get $n
      return
    end

    local.get $n
    i32.const 1
    i32.sub
    call $fib
    local.set $tmp

    local.get $n
    i32.const 2
    i32.sub
    call $fib
    local.get $tmp
    i32.add
    return
  )
)`
  fs.writeFileSync('/fib.wat', wat, 'utf8')
  console.log(wat)

  await start(wat2wasmBuffer, fs, ['wat2wasm', '--version'])
  await start(wat2wasmBuffer, fs, ['wat2wasm', '-o', '/fib.wasm', '/fib.wat'])

  await start(wasmObjdumpBuffer, fs, ['wasm-objdump', '--help'])
  await start(wasmObjdumpBuffer, fs, ['wasm-objdump', '-hx', '/fib.wasm'])

  const fibwasmBuffer = fs.readFileSync('/fib.wasm')
  const fibwasmInstance = await WebAssembly.instantiate(fibwasmBuffer)
  const n = 10
  console.log('fib(%d) => %d', n, fibwasmInstance.instance.exports.fib(n))
}

main()
