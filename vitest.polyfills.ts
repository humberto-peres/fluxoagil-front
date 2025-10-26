import { TextEncoder, TextDecoder } from 'util'

Object.assign(global, {
  TextEncoder,
  TextDecoder,
  URL,
  URLSearchParams,
})

if (typeof global.WeakMap === 'undefined') {
  global.WeakMap = WeakMap
}