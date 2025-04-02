import { create, StateCreator } from "zustand";
import {
  persist,
  createJSONStorage,
  PersistOptions,
  PersistStorage,
} from "zustand/middleware";
import { type KeyPair } from "./types";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";

// Initialize the WASM module (still needed for signing/verifying)
let initPromise: Promise<any> | null = null;

async function initNostringer() {
  if (!initPromise) {
    initPromise = import("@repo/crypto")
      .then(async (module) => {
        const initializedModule = await module.default();
        return module;
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
  clearKeyPair: () => void;
}

// Define the type for the persisted part of the state
type PersistedUserState = Pick<UserState, "keyPair">;

// Explicitly type the state creator and persist options
// Note: The type arguments for PersistOptions need the base state and the persisted state
type UserPersist = (
  config: StateCreator<UserState>,
  options: Omit<PersistOptions<UserState, PersistedUserState>, "storage"> & {
    storage: PersistStorage<PersistedUserState> | undefined;
  }
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
          // Initialize WASM lazily
          await initNostringer();

          // Generate keys using NDK
          const signer = NDKPrivateKeySigner.generate();
          const nsec = signer.nsec;
          if (!nsec) {
            throw new Error("NDK failed to generate nsec.");
          }

          const user = await signer.user();
          const npub = user.npub;
          if (!npub) {
            throw new Error("NDK failed to generate npub.");
          }

          const keyPair: KeyPair = {
            nsec,
            npub,
          };

          set({ keyPair, isLoadingKeyPair: false });
        } catch (error) {
          console.error("Failed to generate key pair:", error);
          set({ isLoadingKeyPair: false });
        }
      },

      setKeyPair: (keyPair: KeyPair | null) => {
        set({ keyPair });
      },

      clearKeyPair: () => {
        set({ keyPair: null });
      },
    }),
    {
      name: "ringable-user-storage",
      storage: createJSONStorage(() => localStorage),
      // Use Pick to correctly type the partialized state
      partialize: (state): PersistedUserState => ({ keyPair: state.keyPair }),
    }
  )
);
