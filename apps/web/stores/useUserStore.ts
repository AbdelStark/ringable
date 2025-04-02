import { create, StateCreator } from "zustand";
import {
  persist,
  createJSONStorage,
  PersistOptions,
  PersistStorage,
} from "zustand/middleware";
import { type KeyPair } from "./types";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
// Don't import useAccountsStore directly - we'll use it from code that uses this hook

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

// For backward compatibility, we'll maintain the keyPair in local storage
type PersistedUserState = Pick<UserState, "keyPair">;

// Explicitly type the state creator and persist options
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

      // We'll keep this simple now and handle the accounts synchronization elsewhere
      generateAndSetKeyPair: async () => {
        if (get().isLoadingKeyPair) return;
        set({ isLoadingKeyPair: true });

        try {
          await initNostringer();

          // Generate keys using NDK (as before)
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

          // We'll leave it to components to sync this with accounts store
          // through a useEffect
        } catch (error) {
          console.error("Failed to generate key pair:", error);
          set({ isLoadingKeyPair: false });
        }
      },

      setKeyPair: (keyPair: KeyPair | null) => {
        set({ keyPair });
        // We'll handle account syncing in components
      },

      clearKeyPair: () => {
        set({ keyPair: null });
      },
    }),
    {
      name: "ringable-user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedUserState => ({ keyPair: state.keyPair }),
    },
  ),
);
