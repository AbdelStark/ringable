import { create, StateCreator } from "zustand";
import {
  persist,
  createJSONStorage,
  PersistOptions,
  PersistStorage,
} from "zustand/middleware";
import { generateKeyPair } from "@repo/crypto";
import { type KeyPair } from "./types";

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
          const newKeyPair = await generateKeyPair();
          set({ keyPair: newKeyPair, isLoadingKeyPair: false });
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
    }
  )
);
