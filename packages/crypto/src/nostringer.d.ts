/* tslint:disable */
/* eslint-disable */
export function start(): void;
/**
 * Generate a new keypair with the specified format
 */
export function wasm_generate_keypair(format: string): WasmKeyPair;
/**
 * Sign a message using a ring signature
 */
export function wasm_sign(
  message: Uint8Array,
  private_key_hex: string,
  ring_pubkeys: any[],
): WasmRingSignature;
/**
 * Verify a ring signature
 */
export function wasm_verify(
  signature: WasmRingSignature,
  message: Uint8Array,
  ring_pubkeys: any[],
): boolean;
/**
 * Sign a message using a BLSAG signature (linkable)
 */
export function wasm_sign_blsag(
  message: Uint8Array,
  private_key_hex: string,
  ring_pubkeys: any[],
): WasmBlsagSignature;
/**
 * Verify a BLSAG signature (linkable)
 */
export function wasm_verify_blsag(
  signature: WasmBlsagSignature,
  message: Uint8Array,
  ring_pubkeys: any[],
): boolean;
/**
 * Check if two key images match (same signer)
 */
export function wasm_key_images_match(image1: string, image2: string): boolean;
/**
 * Sign a message using the compact SAG format, resulting in a 'ringA' prefixed string
 */
export function wasm_sign_compact_sag(
  message: Uint8Array,
  private_key_hex: string,
  ring_pubkeys: any[],
): string;
/**
 * Sign a message using the compact BLSAG format, resulting in a 'ringA' prefixed string
 */
export function wasm_sign_compact_blsag(
  message: Uint8Array,
  private_key_hex: string,
  ring_pubkeys: any[],
): string;
/**
 * Verify a compact signature (both SAG and BLSAG types)
 */
export function wasm_verify_compact(
  compact_signature: string,
  message: Uint8Array,
  ring_pubkeys: any[],
): boolean;
/**
 * Get details about a compact signature (variant and size)
 */
export function wasm_get_compact_signature_info(compact_signature: string): any;
/**
 * Deserializes a compact SAG signature string to a WasmRingSignature
 */
export function wasm_deserialize_compact_sag(
  compact_signature: string,
): WasmRingSignature;
/**
 * Deserializes a compact BLSAG signature string to a WasmBlsagSignature
 */
export function wasm_deserialize_compact_blsag(
  compact_signature: string,
): WasmBlsagSignature;
/**
 * Attempts to deserialize a compact signature string to either type
 * Returns information about the signature type and an optional error
 */
export function wasm_detect_compact_signature_type(
  compact_signature: string,
): any;
/**
 * Serializes a WasmRingSignature to a compact signature string
 */
export function wasm_serialize_ring_signature(
  signature: WasmRingSignature,
): string;
/**
 * Serializes a WasmBlsagSignature to a compact signature string
 */
export function wasm_serialize_blsag_signature(
  signature: WasmBlsagSignature,
): string;
/**
 * WASM-compatible version of the BlsagSignature struct
 */
export class WasmBlsagSignature {
  free(): void;
  /**
   * Creates a new BlsagSignature from components
   */
  constructor(c0: string, s: any[], key_image: string);
  /**
   * Gets the c0 value
   */
  readonly c0: string;
  /**
   * Gets the s values
   */
  readonly s: any[];
  /**
   * Gets the key image
   */
  readonly key_image: string;
}
/**
 * WASM-compatible version of the KeyPairHex struct
 */
export class WasmKeyPair {
  free(): void;
  /**
   * Creates a new KeyPair from components
   */
  constructor(private_key_hex: string, public_key_hex: string);
  /**
   * Gets the private key hex
   */
  readonly private_key_hex: string;
  /**
   * Gets the public key hex
   */
  readonly public_key_hex: string;
}
/**
 * WASM-compatible version of the RingSignature struct
 */
export class WasmRingSignature {
  free(): void;
  /**
   * Creates a new RingSignature from components
   */
  constructor(c0: string, s: any[]);
  /**
   * Gets the c0 value
   */
  readonly c0: string;
  /**
   * Gets the s values
   */
  readonly s: any[];
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmringsignature_free: (a: number, b: number) => void;
  readonly wasmringsignature_new: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly wasmringsignature_c0: (a: number) => [number, number];
  readonly wasmringsignature_s: (a: number) => [number, number];
  readonly __wbg_wasmblsagsignature_free: (a: number, b: number) => void;
  readonly wasmblsagsignature_new: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ) => number;
  readonly wasmblsagsignature_c0: (a: number) => [number, number];
  readonly wasmblsagsignature_s: (a: number) => [number, number];
  readonly wasmblsagsignature_key_image: (a: number) => [number, number];
  readonly __wbg_wasmkeypair_free: (a: number, b: number) => void;
  readonly wasmkeypair_new: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly wasmkeypair_private_key_hex: (a: number) => [number, number];
  readonly wasmkeypair_public_key_hex: (a: number) => [number, number];
  readonly wasm_generate_keypair: (
    a: number,
    b: number,
  ) => [number, number, number];
  readonly wasm_sign: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ) => [number, number, number];
  readonly wasm_verify: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
  ) => [number, number, number];
  readonly wasm_sign_blsag: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ) => [number, number, number];
  readonly wasm_verify_blsag: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
  ) => [number, number, number];
  readonly wasm_key_images_match: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => [number, number, number];
  readonly wasm_sign_compact_sag: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ) => [number, number, number, number];
  readonly wasm_sign_compact_blsag: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ) => [number, number, number, number];
  readonly wasm_verify_compact: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ) => [number, number, number];
  readonly wasm_get_compact_signature_info: (
    a: number,
    b: number,
  ) => [number, number, number];
  readonly wasm_deserialize_compact_sag: (
    a: number,
    b: number,
  ) => [number, number, number];
  readonly wasm_deserialize_compact_blsag: (
    a: number,
    b: number,
  ) => [number, number, number];
  readonly wasm_detect_compact_signature_type: (
    a: number,
    b: number,
  ) => [number, number, number];
  readonly wasm_serialize_ring_signature: (
    a: number,
  ) => [number, number, number, number];
  readonly wasm_serialize_blsag_signature: (
    a: number,
  ) => [number, number, number, number];
  readonly start: () => void;
  readonly rustsecp256k1_v0_10_0_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_10_0_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_10_0_default_illegal_callback_fn: (
    a: number,
    b: number,
  ) => void;
  readonly rustsecp256k1_v0_10_0_default_error_callback_fn: (
    a: number,
    b: number,
  ) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput,
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
