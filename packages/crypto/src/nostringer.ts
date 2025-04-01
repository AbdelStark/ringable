// We will need the Nostringer WASM files here.
// Assuming they will be placed in the web app's public directory (e.g., apps/web/public/)

// --- MOCK IMPLEMENTATION --- //
const MOCK_CRYPTO = true; // Set to false when WASM is available
// --- END MOCK IMPLEMENTATION --- //

// Import types locally now
import type * as NostringerTypes from "./types/nostringer";

// Removed type import - rely on any for now until nostringer.d.ts is available
// import type { KeyPair as NostringerKeyPair } from "../wasm/nostringer";

// Interfaces for clarity
export interface KeyPair {
  publicKeyHex: string;
  privateKeyHex: string;
}

// Define an interface for the expected module structure based on nostringer.d.ts
interface NostringerModule {
  default: () => Promise<void>;
  wasm_generate_keypair: (type: string) => NostringerTypes.KeyPair; // Use imported type
  wasm_sign_blsag: (
    message: Uint8Array,
    privateKeyHex: string,
    ringPublicKeysHex: string[]
  ) => string;
  wasm_verify_blsag: (
    signatureHex: string,
    message: Uint8Array,
    ringPublicKeysHex: string[]
  ) => boolean;
  wasm_key_images_match: (
    signature1Hex: string,
    signature2Hex: string
  ) => boolean;
  // Add other exported functions if needed
}

// Dynamically import the WASM module from the public root
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Using any for WASM module flexibility
async function loadWasmModule(): Promise<NostringerModule> {
  // --- MOCK IMPLEMENTATION --- //
  if (MOCK_CRYPTO) {
    console.warn("CRYPTO MOCK: Skipping WASM load.");
    // Return mock satisfying the interface
    return {
      default: async () => {
        console.warn("CRYPTO MOCK: Skipping WASM init.");
      },
      // Provide mock implementations that match the expected signature (even if they error)
      wasm_generate_keypair: () => {
        throw new Error("CRYPTO MOCK: Not implemented");
      },
      wasm_sign_blsag: () => {
        throw new Error("CRYPTO MOCK: Not implemented");
      },
      wasm_verify_blsag: () => {
        throw new Error("CRYPTO MOCK: Not implemented");
      },
      wasm_key_images_match: () => {
        throw new Error("CRYPTO MOCK: Not implemented");
      },
    };
  }
  // --- END MOCK IMPLEMENTATION --- //

  try {
    // Dynamic import still targets runtime path
    const nostringerModule = await import(
      /* webpackIgnore: true */ "/nostringer.js"
    );
    // Initialize
    await nostringerModule.default();
    // Assert the type for build-time checking
    return nostringerModule as NostringerModule;
  } catch (error) {
    console.error(
      "Failed to load Nostringer WASM module from /nostringer.js:",
      error
    );
    throw new Error("Could not initialize cryptography module.");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Using any for WASM module flexibility
let nostringerApi: NostringerModule | null = null;
let isInitializing = false;
// Adjust promise type to potentially include null on failure
let initializationPromise: Promise<NostringerModule | null | void> | null =
  null;

async function ensureInitialized(): Promise<NostringerModule | void> {
  if (MOCK_CRYPTO) {
    return;
  }

  if (nostringerApi) {
    return nostringerApi;
  }
  if (!initializationPromise) {
    initializationPromise = (async (): Promise<NostringerModule | null> => {
      // Ensure inner promise matches potential null
      if (isInitializing || nostringerApi) {
        return nostringerApi;
      }
      isInitializing = true;
      try {
        nostringerApi = await loadWasmModule();
        console.log("Nostringer WASM module initialized successfully.");
        return nostringerApi;
      } catch (error) {
        console.error("Error during Nostringer initialization:", error);
        initializationPromise = null;
        // Return null on failure to match the Promise type
        return null;
      } finally {
        isInitializing = false;
      }
    })();
  }
  // Await the promise and handle potential null before returning
  const result = await initializationPromise;
  if (!result) {
    // Handle initialization failure case - maybe throw an error or return void
    // Depending on how consuming functions expect to handle it.
    // Throwing might be safer if initialization is critical.
    throw new Error("Crypto module failed to initialize.");
  }
  return result;
}

function generateMockHex(length: number): string {
  let result = "";
  const characters = "0123456789abcdef";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function generateKeyPair(): Promise<KeyPair> {
  // --- MOCK IMPLEMENTATION --- //
  if (MOCK_CRYPTO) {
    console.warn("CRYPTO MOCK: Generating mock key pair.");
    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate async delay
    return {
      publicKeyHex: generateMockHex(64),
      privateKeyHex: generateMockHex(64),
    };
  }
  // --- END MOCK IMPLEMENTATION --- //

  const api = await ensureInitialized();
  if (!api) throw new Error("Crypto module not initialized");
  const kp = api.wasm_generate_keypair("xonly");
  return {
    publicKeyHex: kp.public_key_hex(),
    privateKeyHex: kp.private_key_hex(),
  };
}

export async function signBlsag(
  message: Uint8Array, // Message bytes to sign
  privateKeyHex: string,
  ringPublicKeysHex: string[]
): Promise<string> {
  // Returns signature (assuming hex string)
  // --- MOCK IMPLEMENTATION --- //
  if (MOCK_CRYPTO) {
    console.warn("CRYPTO MOCK: Generating mock BLSAG signature.");
    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate async delay
    // Simple mock: return hash of inputs (not cryptographically secure!)
    const mockSignature = `mockSig_${privateKeyHex.substring(0, 4)}_${ringPublicKeysHex.length}_${message.length}`;
    return mockSignature;
  }
  // --- END MOCK IMPLEMENTATION --- //

  const api = await ensureInitialized();
  if (!api) throw new Error("Crypto module not initialized");
  return api.wasm_sign_blsag(message, privateKeyHex, ringPublicKeysHex);
}

export async function verifyBlsag(
  signatureHex: string,
  message: Uint8Array,
  ringPublicKeysHex: string[]
): Promise<boolean> {
  // --- MOCK IMPLEMENTATION --- //
  if (MOCK_CRYPTO) {
    console.warn("CRYPTO MOCK: Verifying mock BLSAG signature.");
    await new Promise((resolve) => setTimeout(resolve, 20)); // Simulate async delay
    // Simple mock: check if signature starts with "mockSig_"
    return signatureHex.startsWith("mockSig_");
  }
  // --- END MOCK IMPLEMENTATION --- //

  const api = await ensureInitialized();
  if (!api) throw new Error("Crypto module not initialized");
  return api.wasm_verify_blsag(signatureHex, message, ringPublicKeysHex);
}

// Mock key image comparison: assume different signatures from different keys,
// same signature from same key (which our simple mock sign doesn't guarantee, but we fake it).
const mockKeyImageStore: Record<string, string> = {};

export async function keyImagesMatch(
  signature1Hex: string,
  signature2Hex: string
): Promise<boolean> {
  // --- MOCK IMPLEMENTATION --- //
  if (MOCK_CRYPTO) {
    console.warn("CRYPTO MOCK: Comparing mock key images.");
    // Super simple mock: assume signatures only match if they are identical strings
    return signature1Hex === signature2Hex;
  }
  // --- END MOCK IMPLEMENTATION --- //

  const api = await ensureInitialized();
  if (!api) throw new Error("Crypto module not initialized");
  return api.wasm_key_images_match(signature1Hex, signature2Hex);
}
