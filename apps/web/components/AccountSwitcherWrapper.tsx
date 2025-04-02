"use client";

import { useEffect, useState } from "react";
import { AccountSwitcher, useToast } from "@repo/ui";
import { useAccountsStore } from "../stores/useAccountsStore";
import { useUserStore } from "../stores/useUserStore";
import { CreateAccountDialog } from "./CreateAccountDialog";

export function AccountSwitcherWrapper() {
  const { accounts, activeAccountId, setActiveAccount, generateAccount } =
    useAccountsStore();
  const { keyPair, setKeyPair } = useUserStore();
  const { addToast } = useToast();

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // On first load, migrate the current keyPair to accounts system if needed
  useEffect(() => {
    const migrateKeyPair = async () => {
      // If we have a keyPair but no accounts, add it as the first account
      if (keyPair && accounts.length === 0) {
        try {
          const accountsStore = useAccountsStore.getState();
          const id = accountsStore.addAccount(
            "Main Account",
            keyPair.npub,
            keyPair.nsec,
          );
          if (id) {
            setActiveAccount(id);
            addToast(
              "Your account has been migrated to the new accounts system.",
              "info",
            );
          }
        } catch (error) {
          console.error("Failed to migrate account:", error);
        }
      }

      // If we have accounts but no active one, set the first as active
      if (accounts.length > 0 && !activeAccountId) {
        setActiveAccount(accounts[0].id);
      }

      // Sync keyPair with active account
      const activeAccount = accounts.find((acc) => acc.id === activeAccountId);
      if (activeAccount && (!keyPair || keyPair.npub !== activeAccount.npub)) {
        setKeyPair({
          npub: activeAccount.npub,
          nsec: activeAccount.nsec,
        });
      }
    };

    migrateKeyPair();
  }, [accounts.length, activeAccountId, keyPair, setActiveAccount, addToast]);

  const handleSelectAccount = (id: string) => {
    setActiveAccount(id);

    // Update the keyPair in UserStore
    const account = accounts.find((acc) => acc.id === id);
    if (account) {
      setKeyPair({
        npub: account.npub,
        nsec: account.nsec,
      });
      addToast(`Switched to account: ${account.name}`, "success");
    }
  };

  const handleCreateAccount = () => {
    setShowCreateDialog(true);
  };

  const createNewAccount = async (name: string) => {
    try {
      const newId = await generateAccount(name);
      handleSelectAccount(newId); // Switch to the new account
      setShowCreateDialog(false);
      addToast(`Created new account: ${name}`, "success");
    } catch (error) {
      console.error("Failed to create account:", error);
      addToast("Failed to create account", "error");
    }
  };

  // If we don't have any accounts ready yet, show a simplified UI
  if (accounts.length === 0) {
    return null; // Or a placeholder/skeleton
  }

  // Map our accounts data to the UI component's Account format
  const accountsForUi = accounts.map((account) => ({
    id: account.id,
    name: account.name,
    npub: account.npub,
    color: account.color,
  }));

  return (
    <>
      <AccountSwitcher
        accounts={accountsForUi}
        activeAccountId={activeAccountId}
        onSelectAccount={handleSelectAccount}
        onCreateAccount={handleCreateAccount}
      />

      {/* Render dialog component for new account creation */}
      <CreateAccountDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateAccount={createNewAccount}
      />
    </>
  );
}
