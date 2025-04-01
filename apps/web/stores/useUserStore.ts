import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { generateKeyPair } from "@repo/crypto";
import { type KeyPair } from "./types";

interface UserState {
  keyPair: KeyPair | null;
  isLoadingKeyPair: boolean;
  generateAndSetKeyPair: () => Promise<void>;
  setKeyPair: (keyPair: KeyPair | null) => void;
}

// Explicitly type the state creator and persist options
type UserPersist = (
  config: StateCreator<UserState>,
  options: PersistOptions<UserState>
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
          // Optionally: propagate error to UI
        }
      },

      setKeyPair: (keyPair: KeyPair | null) => {
        set({ keyPair });
      },
    }),
    {
      name: "ringable-user-storage", // Name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      // Only persist the keyPair
      partialize: (state) => ({ keyPair: state.keyPair }),
    }
  )
);
