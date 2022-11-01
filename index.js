import { WASI } from '@tybys/wasm-util'
import { Volume, createFsFromVolume } from 'memfs-browser'

async function objdump (buffer, fs, args) {
  const argv = ['wasm-objdump', ...(args || [])]
  const wasi = new WASI({
    args: argv,
    env: {},
    returnOnExit: true,
    preopens: {
      '/': '/'
    },
    // print: (text) => console.log(text),
    // printErr: (text) => console.error(text),
    filesystem: {
      type: 'memfs',
      fs
    }
  })

  const { instance } = await WebAssembly.instantiate(buffer, {
    wasi_snapshot_preview1: wasi.wasiImport
  })
  console.log('%c%s', 'color: green; font-weight: bold', '$ ' + argv.join(' '))
  const exitCode = wasi.start(instance)
  console.log('%c%s', 'color: blue', 'exit: ' + exitCode)
  return exitCode
}

async function main () {
  const arrayBuffer = await (await fetch('./bin/wasm-objdump.wasm')).arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const fs = createFsFromVolume(Volume.fromJSON({
    '/': null
  }))

  fs.writeFileSync('/wasm-objdump.wasm', buffer)

  await objdump(buffer, fs, ['--version'])
  await objdump(buffer, fs, ['--help'])
  await objdump(buffer, fs, ['-h', '/wasm-objdump.wasm'])
  await objdump(buffer, fs, ['-x', '-j', 'Type', '/wasm-objdump.wasm'])
  await objdump(buffer, fs, ['-x', '-j', 'Import', '/wasm-objdump.wasm'])
  await objdump(buffer, fs, ['-x', '-j', 'Table', '/wasm-objdump.wasm'])
  await objdump(buffer, fs, ['-x', '-j', 'Memory', '/wasm-objdump.wasm'])
  await objdump(buffer, fs, ['-x', '-j', 'Global', '/wasm-objdump.wasm'])
  await objdump(buffer, fs, ['-x', '-j', 'Export', '/wasm-objdump.wasm'])
  await objdump(buffer, fs, ['-x', '-j', 'DataCount', '/wasm-objdump.wasm'])
}

main()
