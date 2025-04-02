"use client";

import React, { useEffect, useState } from 'react';
import { AccountSwitcher, useToast } from "@repo/ui";
import { useAccountsStore } from "../stores/useAccountsStore";
import { useUserStore } from "../stores/useUserStore";

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
        const firstAccount = accounts[0];
        if (firstAccount && firstAccount.id) {
          setActiveAccount(firstAccount.id);
        }
      }

      // Sync keyPair with active account
      const activeAccount = accounts.find((acc) => acc.id === activeAccountId);
      if (activeAccount) {
        if (!keyPair || keyPair.npub !== activeAccount.npub) {
          setKeyPair({
            npub: activeAccount.npub,
            nsec: activeAccount.nsec,
          });
        }
      }
    };

    migrateKeyPair().catch((err) => {
      console.error("Error migrating keypair:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts.length, activeAccountId, keyPair?.npub]);

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

  // Create a simple inline account dialog to avoid the import error
  function CreateAccountDialog({
    isOpen,
    onClose,
    onCreateAccount
  }: {
    isOpen: boolean;
    onClose: () => void;
    onCreateAccount: (name: string) => Promise<void>;
  }) {
    const [name, setName] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (name.trim()) {
        await onCreateAccount(name);
        setName('');
      }
    };
    
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative z-10 bg-white border-4 border-pixel-border p-4 shadow-lg max-w-md w-full">
          <h2 className="text-lg font-bold mb-4">Create New Account</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Account Name"
              className="w-full border border-gray-300 p-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 bg-gray-100"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-pixel-accent text-white"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
