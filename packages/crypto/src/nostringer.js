let wasm;

function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_export_2.set(idx, obj);
  return idx;
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}

const cachedTextDecoder =
  typeof TextDecoder !== "undefined"
    ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true })
    : {
        decode: () => {
          throw Error("TextDecoder not available");
        },
      };

if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null ||
    cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len),
  );
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder =
  typeof TextEncoder !== "undefined"
    ? new TextEncoder("utf-8")
    : {
        encode: () => {
          throw Error("TextEncoder not available");
        },
      };

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8ArrayMemory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
  if (
    cachedDataViewMemory0 === null ||
    cachedDataViewMemory0.buffer.detached === true ||
    (cachedDataViewMemory0.buffer.detached === undefined &&
      cachedDataViewMemory0.buffer !== wasm.memory.buffer)
  ) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0;
  for (let i = 0; i < array.length; i++) {
    const add = addToExternrefTable0(array[i]);
    getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
  }
  WASM_VECTOR_LEN = array.length;
  return ptr;
}

function getArrayJsValueFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  const mem = getDataViewMemory0();
  const result = [];
  for (let i = ptr; i < ptr + 4 * len; i += 4) {
    result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
  }
  wasm.__externref_drop_slice(ptr, len);
  return result;
}

export function start() {
  wasm.start();
}

function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_2.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
/**
 * Generate a new keypair with the specified format
 * @param {string} format
 * @returns {WasmKeyPair}
 */
export function wasm_generate_keypair(format) {
  const ptr0 = passStringToWasm0(
    format,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_generate_keypair(ptr0, len0);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return WasmKeyPair.__wrap(ret[0]);
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
/**
 * Sign a message using a ring signature
 * @param {Uint8Array} message
 * @param {string} private_key_hex
 * @param {any[]} ring_pubkeys
 * @returns {WasmRingSignature}
 */
export function wasm_sign(message, private_key_hex, ring_pubkeys) {
  const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passStringToWasm0(
    private_key_hex,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  const ptr2 = passArrayJsValueToWasm0(ring_pubkeys, wasm.__wbindgen_malloc);
  const len2 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_sign(ptr0, len0, ptr1, len1, ptr2, len2);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return WasmRingSignature.__wrap(ret[0]);
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
}
/**
 * Verify a ring signature
 * @param {WasmRingSignature} signature
 * @param {Uint8Array} message
 * @param {any[]} ring_pubkeys
 * @returns {boolean}
 */
export function wasm_verify(signature, message, ring_pubkeys) {
  _assertClass(signature, WasmRingSignature);
  const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passArrayJsValueToWasm0(ring_pubkeys, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_verify(signature.__wbg_ptr, ptr0, len0, ptr1, len1);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return ret[0] !== 0;
}

/**
 * Sign a message using a BLSAG signature (linkable)
 * @param {Uint8Array} message
 * @param {string} private_key_hex
 * @param {any[]} ring_pubkeys
 * @returns {WasmBlsagSignature}
 */
export function wasm_sign_blsag(message, private_key_hex, ring_pubkeys) {
  const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passStringToWasm0(
    private_key_hex,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  const ptr2 = passArrayJsValueToWasm0(ring_pubkeys, wasm.__wbindgen_malloc);
  const len2 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_sign_blsag(ptr0, len0, ptr1, len1, ptr2, len2);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return WasmBlsagSignature.__wrap(ret[0]);
}

/**
 * Verify a BLSAG signature (linkable)
 * @param {WasmBlsagSignature} signature
 * @param {Uint8Array} message
 * @param {any[]} ring_pubkeys
 * @returns {boolean}
 */
export function wasm_verify_blsag(signature, message, ring_pubkeys) {
  _assertClass(signature, WasmBlsagSignature);
  const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passArrayJsValueToWasm0(ring_pubkeys, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_verify_blsag(
    signature.__wbg_ptr,
    ptr0,
    len0,
    ptr1,
    len1,
  );
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return ret[0] !== 0;
}

/**
 * Check if two key images match (same signer)
 * @param {string} image1
 * @param {string} image2
 * @returns {boolean}
 */
export function wasm_key_images_match(image1, image2) {
  const ptr0 = passStringToWasm0(
    image1,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passStringToWasm0(
    image2,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_key_images_match(ptr0, len0, ptr1, len1);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return ret[0] !== 0;
}

/**
 * Sign a message using the compact SAG format, resulting in a 'ringA' prefixed string
 * @param {Uint8Array} message
 * @param {string} private_key_hex
 * @param {any[]} ring_pubkeys
 * @returns {string}
 */
export function wasm_sign_compact_sag(message, private_key_hex, ring_pubkeys) {
  let deferred5_0;
  let deferred5_1;
  try {
    const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(
      private_key_hex,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArrayJsValueToWasm0(ring_pubkeys, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.wasm_sign_compact_sag(ptr0, len0, ptr1, len1, ptr2, len2);
    var ptr4 = ret[0];
    var len4 = ret[1];
    if (ret[3]) {
      ptr4 = 0;
      len4 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred5_0 = ptr4;
    deferred5_1 = len4;
    return getStringFromWasm0(ptr4, len4);
  } finally {
    wasm.__wbindgen_free(deferred5_0, deferred5_1, 1);
  }
}

/**
 * Sign a message using the compact BLSAG format, resulting in a 'ringA' prefixed string
 * @param {Uint8Array} message
 * @param {string} private_key_hex
 * @param {any[]} ring_pubkeys
 * @returns {string}
 */
export function wasm_sign_compact_blsag(
  message,
  private_key_hex,
  ring_pubkeys,
) {
  let deferred5_0;
  let deferred5_1;
  try {
    const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(
      private_key_hex,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArrayJsValueToWasm0(ring_pubkeys, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.wasm_sign_compact_blsag(
      ptr0,
      len0,
      ptr1,
      len1,
      ptr2,
      len2,
    );
    var ptr4 = ret[0];
    var len4 = ret[1];
    if (ret[3]) {
      ptr4 = 0;
      len4 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred5_0 = ptr4;
    deferred5_1 = len4;
    return getStringFromWasm0(ptr4, len4);
  } finally {
    wasm.__wbindgen_free(deferred5_0, deferred5_1, 1);
  }
}

/**
 * Verify a compact signature (both SAG and BLSAG types)
 * @param {string} compact_signature
 * @param {Uint8Array} message
 * @param {any[]} ring_pubkeys
 * @returns {boolean}
 */
export function wasm_verify_compact(compact_signature, message, ring_pubkeys) {
  const ptr0 = passStringToWasm0(
    compact_signature,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  const ptr2 = passArrayJsValueToWasm0(ring_pubkeys, wasm.__wbindgen_malloc);
  const len2 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_verify_compact(ptr0, len0, ptr1, len1, ptr2, len2);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return ret[0] !== 0;
}

/**
 * Get details about a compact signature (variant and size)
 * @param {string} compact_signature
 * @returns {any}
 */
export function wasm_get_compact_signature_info(compact_signature) {
  const ptr0 = passStringToWasm0(
    compact_signature,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_get_compact_signature_info(ptr0, len0);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}

/**
 * Deserializes a compact SAG signature string to a WasmRingSignature
 * @param {string} compact_signature
 * @returns {WasmRingSignature}
 */
export function wasm_deserialize_compact_sag(compact_signature) {
  const ptr0 = passStringToWasm0(
    compact_signature,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_deserialize_compact_sag(ptr0, len0);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return WasmRingSignature.__wrap(ret[0]);
}

/**
 * Deserializes a compact BLSAG signature string to a WasmBlsagSignature
 * @param {string} compact_signature
 * @returns {WasmBlsagSignature}
 */
export function wasm_deserialize_compact_blsag(compact_signature) {
  const ptr0 = passStringToWasm0(
    compact_signature,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_deserialize_compact_blsag(ptr0, len0);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return WasmBlsagSignature.__wrap(ret[0]);
}

/**
 * Attempts to deserialize a compact signature string to either type
 * Returns information about the signature type and an optional error
 * @param {string} compact_signature
 * @returns {any}
 */
export function wasm_detect_compact_signature_type(compact_signature) {
  const ptr0 = passStringToWasm0(
    compact_signature,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.wasm_detect_compact_signature_type(ptr0, len0);
  if (ret[2]) {
    throw takeFromExternrefTable0(ret[1]);
  }
  return takeFromExternrefTable0(ret[0]);
}

/**
 * Serializes a WasmRingSignature to a compact signature string
 * @param {WasmRingSignature} signature
 * @returns {string}
 */
export function wasm_serialize_ring_signature(signature) {
  let deferred2_0;
  let deferred2_1;
  try {
    _assertClass(signature, WasmRingSignature);
    const ret = wasm.wasm_serialize_ring_signature(signature.__wbg_ptr);
    var ptr1 = ret[0];
    var len1 = ret[1];
    if (ret[3]) {
      ptr1 = 0;
      len1 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred2_0 = ptr1;
    deferred2_1 = len1;
    return getStringFromWasm0(ptr1, len1);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}

/**
 * Serializes a WasmBlsagSignature to a compact signature string
 * @param {WasmBlsagSignature} signature
 * @returns {string}
 */
export function wasm_serialize_blsag_signature(signature) {
  let deferred2_0;
  let deferred2_1;
  try {
    _assertClass(signature, WasmBlsagSignature);
    const ret = wasm.wasm_serialize_blsag_signature(signature.__wbg_ptr);
    var ptr1 = ret[0];
    var len1 = ret[1];
    if (ret[3]) {
      ptr1 = 0;
      len1 = 0;
      throw takeFromExternrefTable0(ret[2]);
    }
    deferred2_0 = ptr1;
    deferred2_1 = len1;
    return getStringFromWasm0(ptr1, len1);
  } finally {
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}

const WasmBlsagSignatureFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_wasmblsagsignature_free(ptr >>> 0, 1),
      );
/**
 * WASM-compatible version of the BlsagSignature struct
 */
export class WasmBlsagSignature {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(WasmBlsagSignature.prototype);
    obj.__wbg_ptr = ptr;
    WasmBlsagSignatureFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    WasmBlsagSignatureFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_wasmblsagsignature_free(ptr, 0);
  }
  /**
   * Creates a new BlsagSignature from components
   * @param {string} c0
   * @param {any[]} s
   * @param {string} key_image
   */
  constructor(c0, s, key_image) {
    const ptr0 = passStringToWasm0(
      c0,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayJsValueToWasm0(s, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(
      key_image,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.wasmblsagsignature_new(ptr0, len0, ptr1, len1, ptr2, len2);
    this.__wbg_ptr = ret >>> 0;
    WasmBlsagSignatureFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * Gets the c0 value
   * @returns {string}
   */
  get c0() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.wasmblsagsignature_c0(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Gets the s values
   * @returns {any[]}
   */
  get s() {
    const ret = wasm.wasmblsagsignature_s(this.__wbg_ptr);
    var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
  /**
   * Gets the key image
   * @returns {string}
   */
  get key_image() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.wasmblsagsignature_key_image(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
}

const WasmKeyPairFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_wasmkeypair_free(ptr >>> 0, 1),
      );
/**
 * WASM-compatible version of the KeyPairHex struct
 */
export class WasmKeyPair {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(WasmKeyPair.prototype);
    obj.__wbg_ptr = ptr;
    WasmKeyPairFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    WasmKeyPairFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_wasmkeypair_free(ptr, 0);
  }
  /**
   * Creates a new KeyPair from components
   * @param {string} private_key_hex
   * @param {string} public_key_hex
   */
  constructor(private_key_hex, public_key_hex) {
    const ptr0 = passStringToWasm0(
      private_key_hex,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(
      public_key_hex,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.wasmkeypair_new(ptr0, len0, ptr1, len1);
    this.__wbg_ptr = ret >>> 0;
    WasmKeyPairFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * Gets the private key hex
   * @returns {string}
   */
  get private_key_hex() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.wasmkeypair_private_key_hex(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Gets the public key hex
   * @returns {string}
   */
  get public_key_hex() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.wasmkeypair_public_key_hex(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
}

const WasmRingSignatureFinalization =
  typeof FinalizationRegistry === "undefined"
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) =>
        wasm.__wbg_wasmringsignature_free(ptr >>> 0, 1),
      );
/**
 * WASM-compatible version of the RingSignature struct
 */
export class WasmRingSignature {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(WasmRingSignature.prototype);
    obj.__wbg_ptr = ptr;
    WasmRingSignatureFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    WasmRingSignatureFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_wasmringsignature_free(ptr, 0);
  }
  /**
   * Creates a new RingSignature from components
   * @param {string} c0
   * @param {any[]} s
   */
  constructor(c0, s) {
    const ptr0 = passStringToWasm0(
      c0,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayJsValueToWasm0(s, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.wasmringsignature_new(ptr0, len0, ptr1, len1);
    this.__wbg_ptr = ret >>> 0;
    WasmRingSignatureFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * Gets the c0 value
   * @returns {string}
   */
  get c0() {
    let deferred1_0;
    let deferred1_1;
    try {
      const ret = wasm.wasmringsignature_c0(this.__wbg_ptr);
      deferred1_0 = ret[0];
      deferred1_1 = ret[1];
      return getStringFromWasm0(ret[0], ret[1]);
    } finally {
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Gets the s values
   * @returns {any[]}
   */
  get s() {
    const ret = wasm.wasmringsignature_s(this.__wbg_ptr);
    var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v1;
  }
}

async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn(
            "`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
            e,
          );
        } else {
          throw e;
        }
      }
    }

    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}

function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_buffer_609cc3eee51ed158 = function (arg0) {
    const ret = arg0.buffer;
    return ret;
  };
  imports.wbg.__wbg_call_672a4d21634d4a24 = function () {
    return handleError(function (arg0, arg1) {
      const ret = arg0.call(arg1);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_call_7cccdd69e0791ae2 = function () {
    return handleError(function (arg0, arg1, arg2) {
      const ret = arg0.call(arg1, arg2);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_crypto_ed58b8e10a292839 = function (arg0) {
    const ret = arg0.crypto;
    return ret;
  };
  imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function (arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
      deferred0_0 = arg0;
      deferred0_1 = arg1;
      console.error(getStringFromWasm0(arg0, arg1));
    } finally {
      wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
  };
  imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function () {
    return handleError(function (arg0, arg1) {
      arg0.getRandomValues(arg1);
    }, arguments);
  };
  imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function (arg0) {
    const ret = arg0.msCrypto;
    return ret;
  };
  imports.wbg.__wbg_new_405e22f390576ce2 = function () {
    const ret = new Object();
    return ret;
  };
  imports.wbg.__wbg_new_8a6f238a6ece86ea = function () {
    const ret = new Error();
    return ret;
  };
  imports.wbg.__wbg_new_a12002a7f91c75be = function (arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
  };
  imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function (arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
  };
  imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function (
    arg0,
    arg1,
    arg2,
  ) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function (arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_node_02999533c4ea02e3 = function (arg0) {
    const ret = arg0.node;
    return ret;
  };
  imports.wbg.__wbg_process_5c1d670bc53614b8 = function (arg0) {
    const ret = arg0.process;
    return ret;
  };
  imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function () {
    return handleError(function (arg0, arg1) {
      arg0.randomFillSync(arg1);
    }, arguments);
  };
  imports.wbg.__wbg_require_79b1e9274cde3c87 = function () {
    return handleError(function () {
      const ret = module.require;
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_set_65595bdd868b3009 = function (arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
  };
  imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function () {
    return handleError(function (arg0, arg1, arg2) {
      const ret = Reflect.set(arg0, arg1, arg2);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_stack_0ed75d68575b0f3c = function (arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function () {
    const ret = typeof global === "undefined" ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function () {
    const ret = typeof globalThis === "undefined" ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function () {
    const ret = typeof self === "undefined" ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function () {
    const ret = typeof window === "undefined" ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function (arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
  };
  imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function (arg0) {
    const ret = arg0.versions;
    return ret;
  };
  imports.wbg.__wbindgen_init_externref_table = function () {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
  };
  imports.wbg.__wbindgen_is_function = function (arg0) {
    const ret = typeof arg0 === "function";
    return ret;
  };
  imports.wbg.__wbindgen_is_object = function (arg0) {
    const val = arg0;
    const ret = typeof val === "object" && val !== null;
    return ret;
  };
  imports.wbg.__wbindgen_is_string = function (arg0) {
    const ret = typeof arg0 === "string";
    return ret;
  };
  imports.wbg.__wbindgen_is_undefined = function (arg0) {
    const ret = arg0 === undefined;
    return ret;
  };
  imports.wbg.__wbindgen_memory = function () {
    const ret = wasm.memory;
    return ret;
  };
  imports.wbg.__wbindgen_number_new = function (arg0) {
    const ret = arg0;
    return ret;
  };
  imports.wbg.__wbindgen_string_get = function (arg0, arg1) {
    const obj = arg1;
    const ret = typeof obj === "string" ? obj : undefined;
    var ptr1 = isLikeNone(ret)
      ? 0
      : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
  };
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };

  return imports;
}

function __wbg_init_memory(imports, memory) {}

function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedDataViewMemory0 = null;
  cachedUint8ArrayMemory0 = null;

  wasm.__wbindgen_start();
  return wasm;
}

function initSync(module) {
  if (wasm !== undefined) return wasm;

  if (typeof module !== "undefined") {
    if (Object.getPrototypeOf(module) === Object.prototype) {
      ({ module } = module);
    } else {
      console.warn(
        "using deprecated parameters for `initSync()`; pass a single object instead",
      );
    }
  }

  const imports = __wbg_get_imports();

  __wbg_init_memory(imports);

  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module);
  }

  const instance = new WebAssembly.Instance(module, imports);

  return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
  if (wasm !== undefined) return wasm;

  if (typeof module_or_path !== "undefined") {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn(
        "using deprecated parameters for the initialization function; pass a single object instead",
      );
    }
  }

  if (typeof module_or_path === "undefined") {
    module_or_path = new URL("nostringer_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();

  if (
    typeof module_or_path === "string" ||
    (typeof Request === "function" && module_or_path instanceof Request) ||
    (typeof URL === "function" && module_or_path instanceof URL)
  ) {
    module_or_path = fetch(module_or_path);
  }

  __wbg_init_memory(imports);

  const { instance, module } = await __wbg_load(await module_or_path, imports);

  return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
