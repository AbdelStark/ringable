import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { v4 as uuidv4 } from "uuid";

// A user account contains a keypair plus metadata
export interface UserAccount {
  id: string; // UUID to identify this account
  name: string; // User-friendly name
  npub: string; // Public key
  nsec: string; // Private key
  createdAt: number; // Timestamp
  color: string; // Color for UI differentiation (no longer optional)
}

interface AccountsState {
  accounts: UserAccount[];
  activeAccountId: string | null;

  // Actions
  addAccount: (name: string, npub: string, nsec: string) => string;
  generateAccount: (name: string) => Promise<string>;
  removeAccount: (id: string) => void;
  renameAccount: (id: string, newName: string) => void;
  setActiveAccount: (id: string) => void;
  getActiveAccount: () => UserAccount | null;
  updateAccountColor: (id: string, color: string) => void;
}

// For persisting specific parts of the state
type AccountsPersist = (
  config: StateCreator<AccountsState>,
  options: PersistOptions<
    AccountsState,
    Pick<AccountsState, "accounts" | "activeAccountId">
  >
) => StateCreator<AccountsState>;

export const useAccountsStore = create<AccountsState>(
  (persist as AccountsPersist)(
    (set, get) => ({
      accounts: [],
      activeAccountId: null,

      addAccount: (name: string, npub: string, nsec: string) => {
        const id = uuidv4();
        const accountColor = getRandomColor();

        const newAccount: UserAccount = {
          id,
          name: name || `Account ${get().accounts.length + 1}`,
          npub,
          nsec,
          createdAt: Date.now(),
          color: accountColor,
        };

        set((state) => ({
          accounts: [...state.accounts, newAccount],
          // If this is the first account, make it active
          activeAccountId: state.activeAccountId || id,
        }));

        return id;
      },

      generateAccount: async (name: string) => {
        try {
          const signer = NDKPrivateKeySigner.generate();
          const nsec = signer.nsec;
          const user = await signer.user();
          const npub = user.npub;

          if (!nsec || !npub) {
            throw new Error("Failed to generate keys");
          }

          return get().addAccount(
            name || `Account ${get().accounts.length + 1}`,
            npub,
            nsec
          );
        } catch (error) {
          console.error("Failed to generate account:", error);
          throw error;
        }
      },

      removeAccount: (id: string) => {
        const { accounts, activeAccountId } = get();

        // Don't allow removing the last account
        if (accounts.length <= 1) {
          console.warn("Cannot remove the only account");
          return;
        }

        // If removing the active account, select another one
        let newActiveId = activeAccountId;
        if (id === activeAccountId) {
          // Find the first account that isn't being removed
          const otherAccount = accounts.find((a) => a && a.id && a.id !== id);
          newActiveId = otherAccount?.id || null;
        }

        set({
          accounts: accounts.filter((account) => account && account.id !== id),
          activeAccountId: newActiveId,
        });
      },

      renameAccount: (id: string, newName: string) => {
        if (!newName.trim()) return;

        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === id ? { ...account, name: newName.trim() } : account
          ),
        }));
      },

      setActiveAccount: (id: string) => {
        const accountExists = get().accounts.some((a) => a.id === id);
        if (accountExists) {
          set({ activeAccountId: id });
        }
      },

      getActiveAccount: () => {
        const { accounts, activeAccountId } = get();
        if (!activeAccountId) return null;
        return (
          accounts.find((account) => account.id === activeAccountId) || null
        );
      },

      updateAccountColor: (id: string, color: string) => {
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === id ? { ...account, color } : account
          ),
        }));
      },
    }),
    {
      name: "ringable-accounts-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accounts: state.accounts,
        activeAccountId: state.activeAccountId,
      }),
    }
  )
);

// Helper function to generate a random color
function getRandomColor(): string {
  const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#FFD166", // Yellow
    "#6B5CA5", // Purple
    "#72B01D", // Green
    "#3A86FF", // Blue
    "#F15BB5", // Pink
    "#FF9F1C", // Orange
  ];
  const index = Math.floor(Math.random() * colors.length);
  return colors[index] || "#4ECDC4"; // Fallback to teal if somehow the random index fails
}
