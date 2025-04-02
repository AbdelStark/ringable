/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const __wbg_wasmringsignature_free: (a: number, b: number) => void;
export const wasmringsignature_new: (
  a: number,
  b: number,
  c: number,
  d: number,
) => number;
export const wasmringsignature_c0: (a: number) => [number, number];
export const wasmringsignature_s: (a: number) => [number, number];
export const __wbg_wasmblsagsignature_free: (a: number, b: number) => void;
export const wasmblsagsignature_new: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
) => number;
export const wasmblsagsignature_c0: (a: number) => [number, number];
export const wasmblsagsignature_s: (a: number) => [number, number];
export const wasmblsagsignature_key_image: (a: number) => [number, number];
export const __wbg_wasmkeypair_free: (a: number, b: number) => void;
export const wasmkeypair_new: (
  a: number,
  b: number,
  c: number,
  d: number,
) => number;
export const wasmkeypair_private_key_hex: (a: number) => [number, number];
export const wasmkeypair_public_key_hex: (a: number) => [number, number];
export const wasm_generate_keypair: (
  a: number,
  b: number,
) => [number, number, number];
export const wasm_sign: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
) => [number, number, number];
export const wasm_verify: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
) => [number, number, number];
export const wasm_sign_blsag: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
) => [number, number, number];
export const wasm_verify_blsag: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
) => [number, number, number];
export const wasm_key_images_match: (
  a: number,
  b: number,
  c: number,
  d: number,
) => [number, number, number];
export const wasm_sign_compact_sag: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
) => [number, number, number, number];
export const wasm_sign_compact_blsag: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
) => [number, number, number, number];
export const wasm_verify_compact: (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
) => [number, number, number];
export const wasm_get_compact_signature_info: (
  a: number,
  b: number,
) => [number, number, number];
export const wasm_deserialize_compact_sag: (
  a: number,
  b: number,
) => [number, number, number];
export const wasm_deserialize_compact_blsag: (
  a: number,
  b: number,
) => [number, number, number];
export const wasm_detect_compact_signature_type: (
  a: number,
  b: number,
) => [number, number, number];
export const wasm_serialize_ring_signature: (
  a: number,
) => [number, number, number, number];
export const wasm_serialize_blsag_signature: (
  a: number,
) => [number, number, number, number];
export const start: () => void;
export const rustsecp256k1_v0_10_0_context_create: (a: number) => number;
export const rustsecp256k1_v0_10_0_context_destroy: (a: number) => void;
export const rustsecp256k1_v0_10_0_default_illegal_callback_fn: (
  a: number,
  b: number,
) => void;
export const rustsecp256k1_v0_10_0_default_error_callback_fn: (
  a: number,
  b: number,
) => void;
export const __wbindgen_exn_store: (a: number) => void;
export const __externref_table_alloc: () => number;
export const __wbindgen_export_2: WebAssembly.Table;
export const __wbindgen_free: (a: number, b: number, c: number) => void;
export const __wbindgen_malloc: (a: number, b: number) => number;
export const __wbindgen_realloc: (
  a: number,
  b: number,
  c: number,
  d: number,
) => number;
export const __externref_drop_slice: (a: number, b: number) => void;
export const __externref_table_dealloc: (a: number) => void;
export const __wbindgen_start: () => void;
