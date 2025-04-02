import { create, StateCreator } from "zustand";
import {
  persist,
  createJSONStorage,
  PersistOptions,
  PersistStorage,
} from "zustand/middleware";
import { type KeyPair } from "./types";

// Initialize the WASM module
let initPromise: Promise<any> | null = null;

async function initNostringer() {
  if (!initPromise) {
    initPromise = import("@repo/crypto")
      .then(async (module) => {
        // Initialize the WASM module first using the default export
        const initializedModule = await module.default();
        return module; // Return the module with all functions
      })
      .catch((err) => {
        console.error("Failed to initialize Nostringer WASM:", err);
        initPromise = null;
        throw err;
      });
  }

  return initPromise;
}

interface UserState {
  keyPair: KeyPair | null;
  isLoadingKeyPair: boolean;
  generateAndSetKeyPair: () => Promise<void>;
  setKeyPair: (keyPair: KeyPair | null) => void;
}

// Define the type for the persisted part of the state
type PersistedUserState = Pick<UserState, "keyPair">;

// Explicitly type the state creator and persist options
// Note: The type arguments for PersistOptions need the base state and the persisted state
type UserPersist = (
  config: StateCreator<UserState>,
  options: Omit<PersistOptions<UserState, PersistedUserState>, "storage"> & {
    storage: PersistStorage<PersistedUserState> | undefined;
  },
) => StateCreator<UserState>;

export const useUserStore = create<UserState>(
  (persist as UserPersist)(
    (set, get) => ({
      keyPair: null,
      isLoadingKeyPair: false,

      generateAndSetKeyPair: async () => {
        if (get().isLoadingKeyPair || get().keyPair) return;
        set({ isLoadingKeyPair: true });
        try {
          // First ensure the WASM module is initialized
          const module = await initNostringer();

          // Now it's safe to call the WASM function
          const wasmKeyPair = module.wasm_generate_keypair("xonly");

          // Extract the serializable values from the WASM object
          const keyPair: KeyPair = {
            privateKeyHex: wasmKeyPair.private_key_hex,
            publicKeyHex: wasmKeyPair.public_key_hex,
          };

          // Always call free() if the WASM object has this method to prevent memory leaks
          if (typeof wasmKeyPair.free === "function") {
            wasmKeyPair.free();
          }

          set({ keyPair, isLoadingKeyPair: false });
        } catch (error) {
          console.error("Failed to generate key pair:", error);
          set({ isLoadingKeyPair: false });
        }
      },

      setKeyPair: (keyPair: KeyPair | null) => {
        set({ keyPair });
      },
    }),
    {
      name: "ringable-user-storage",
      storage: createJSONStorage(() => localStorage),
      // Use Pick to correctly type the partialized state
      partialize: (state): PersistedUserState => ({ keyPair: state.keyPair }),
    },
  ),
);
