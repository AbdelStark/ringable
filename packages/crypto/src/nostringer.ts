// We will need the Nostringer WASM files here.
// Assuming they will be placed in the web app's public directory (e.g., apps/web/public/)

// --- MOCK IMPLEMENTATION --- //
const MOCK_CRYPTO = true; // Set to false when WASM is available
// --- END MOCK IMPLEMENTATION --- //

// Removed type import - rely on any for now until nostringer.d.ts is available
// import type { KeyPair as NostringerKeyPair } from "../wasm/nostringer";

// Interfaces for clarity
export interface KeyPair {
  publicKeyHex: string;
  privateKeyHex: string;
}

// Dynamically import the WASM module from the public root
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Using any for WASM module flexibility
async function loadWasmModule(): Promise<any> {
  // --- MOCK IMPLEMENTATION --- //
  if (MOCK_CRYPTO) {
    console.warn("CRYPTO MOCK: Skipping WASM load.");
    // Return a mock object simulating the WASM module structure if needed by ensureInitialized
    return {
      default: async () => {
        console.warn("CRYPTO MOCK: Skipping WASM init.");
      },
      wasm_generate_keypair: () => {
        throw new Error("WASM not loaded");
      },
      wasm_sign_blsag: () => {
        throw new Error("WASM not loaded");
      },
      wasm_verify_blsag: () => {
        throw new Error("WASM not loaded");
      },
      wasm_key_images_match: () => {
        throw new Error("WASM not loaded");
      },
    };
  }
  // --- END MOCK IMPLEMENTATION --- //

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- dynamic import
    const nostringerModule = await import(
      /* webpackIgnore: true */ "/nostringer.js"
    ); // Path relative to public root
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- dynamic import
    await nostringerModule.default(); // Initialize the WASM module
    return nostringerModule;
  } catch (error) {
    console.error(
      "Failed to load Nostringer WASM module from /nostringer.js:",
      error
    );
    throw new Error("Could not initialize cryptography module.");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Using any for WASM module flexibility
let nostringerApi: any | null = null;
let isInitializing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Using any for WASM module flexibility
let initializationPromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Using any for WASM module flexibility
async function ensureInitialized(): Promise<any> {
  // --- MOCK IMPLEMENTATION --- //
  if (MOCK_CRYPTO) {
    return; // In mock mode, functions will provide their own mocks
  }
  // --- END MOCK IMPLEMENTATION --- //

  // (Original initialization logic remains for when MOCK_CRYPTO is false)
  if (nostringerApi) {
    return nostringerApi;
  }
  if (!initializationPromise) {
    initializationPromise = (async () => {
      if (isInitializing || nostringerApi) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- dynamic import
        return nostringerApi;
      }
      isInitializing = true;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- dynamic import
        nostringerApi = await loadWasmModule();
        console.log("Nostringer WASM module initialized successfully.");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- dynamic import
        return nostringerApi;
      } catch (error) {
        console.error("Error during Nostringer initialization:", error);
        initializationPromise = null; // Reset promise on failure
        throw error;
      } finally {
        isInitializing = false;
      }
    })();
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- dynamic import
  return await initializationPromise;
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment -- WASM call
  const kp = api.wasm_generate_keypair("xonly");
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- WASM call
    publicKeyHex: kp.public_key_hex(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- WASM call
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return -- WASM call
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return -- WASM call
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return -- WASM call
  return api.wasm_key_images_match(signature1Hex, signature2Hex);
}
