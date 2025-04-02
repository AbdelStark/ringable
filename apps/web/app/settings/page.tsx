"use client";

import * as React from "react";
import {
  Button,
  Card,
  Input,
  useToast,
  ConfirmDialog,
  AccountManager,
} from "@repo/ui";
import { useUserStore } from "../../stores/useUserStore";
import { useAccountsStore } from "../../stores/useAccountsStore";
import Link from "next/link";

export default function SettingsPage() {
  const {
    keyPair,
    generateAndSetKeyPair,
    isLoadingKeyPair,
    setKeyPair,
    clearKeyPair,
  } = useUserStore();
  const {
    accounts,
    activeAccountId,
    setActiveAccount,
    generateAccount,
    renameAccount,
    removeAccount,
  } = useAccountsStore();
  const { addToast } = useToast();

  const [copied, setCopied] = React.useState(false);
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  // Map account data for the AccountManager
  const accountsForManager = React.useMemo(
    () =>
      accounts.map((account) => ({
        id: account.id,
        name: account.name,
        npub: account.npub,
        color: account.color,
      })),
    [accounts],
  );

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        addToast("Public key copied to clipboard!", "success", 1500);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        addToast("Failed to copy key.", "error");
      });
  };

  const handleCreateAccount = async (name: string): Promise<void> => {
    await generateAccount(name);
  };

  const handleSelectAccount = (id: string) => {
    setActiveAccount(id);

    // Update the keyPair to match the selected account
    const account = accounts.find((acc) => acc.id === id);
    if (account) {
      setKeyPair({
        npub: account.npub,
        nsec: account.nsec,
      });
      addToast(`Switched to account: ${account.name}`, "success");
    }
  };

  const confirmClearKeyPair = () => {
    clearKeyPair();
    setShowClearConfirm(false);
    addToast("Keypair cleared.", "info");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold uppercase tracking-wider">Settings</h2>
        <Link href="/" className="text-sm text-pixel-accent hover:underline">
          &lt;- Back to Home
        </Link>
      </div>

      {/* Active Account Card */}
      <Card title="Your Active Account" className="mb-6">
        {isLoadingKeyPair ? (
          <p>Loading...</p>
        ) : keyPair ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-normal text-pixel-text mb-1 uppercase tracking-wider">
                Public Key
              </label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={keyPair.npub}
                  className="bg-gray-100 text-xs flex-grow"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleCopy(keyPair.npub);
                  }}
                  className="text-xs"
                  disabled={copied}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-sm">
              You don't have an identity keypair yet.
            </p>
            <Button onClick={generateAndSetKeyPair} disabled={isLoadingKeyPair}>
              {isLoadingKeyPair ? "Generating..." : "Generate New Keypair"}
            </Button>
          </div>
        )}
      </Card>

      {/* Account Manager */}
      <AccountManager
        accounts={accountsForManager}
        activeAccountId={activeAccountId}
        onSelectAccount={handleSelectAccount}
        onCreateAccount={handleCreateAccount}
        onRenameAccount={renameAccount}
        onDeleteAccount={removeAccount}
      />

      {/* Confirmation Dialog for Clearing Keypair */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear Keypair"
        message="Are you sure you want to clear your current keypair? This action cannot be undone and will remove your identity from this browser."
        onConfirm={confirmClearKeyPair}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
