"use client";

import * as React from "react";
import { Button, Card, Input, useToast, ConfirmDialog } from "@repo/ui";
import { useUserStore } from "../../stores/useUserStore";
import Link from "next/link"; // For navigation

export default function SettingsPage() {
  const {
    keyPair,
    generateAndSetKeyPair,
    isLoadingKeyPair,
    setKeyPair,
    clearKeyPair,
  } = useUserStore();
  const { addToast } = useToast();

  const [copied, setCopied] = React.useState(false);
  const [showPrivateKeyInput, setShowPrivateKeyInput] = React.useState(false);
  const [privateKeyInput, setPrivateKeyInput] = React.useState("");
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        addToast("Public key copied to clipboard!", "success", 1500);
        setTimeout(() => setCopied(false), 1500); // Reset after 1.5 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        addToast("Failed to copy key.", "error");
      });
  };

  const handleLoadPrivateKey = () => {
    if (privateKeyInput.startsWith("nsec1") && privateKeyInput.length > 60) {
      try {
        const derivedNpub = "npub-derived-from-" + privateKeyInput.substring(0, 12) + "...";

        setKeyPair({
          npub: derivedNpub,
          nsec: privateKeyInput,
        });
        setShowPrivateKeyInput(false);
        setPrivateKeyInput("");
        addToast("Private key loaded successfully.", "success");
      } catch (error) {
        console.error("Error deriving public key from nsec:", error);
        addToast("Invalid private key or failed to derive public key.", "error");
      }
    } else {
      addToast("Invalid private key format. Must be an NSEC string (starts with nsec1).", "error");
    }
  };

  const confirmClearKeyPair = () => {
    clearKeyPair();
    setShowClearConfirm(false);
    addToast("Keypair cleared.", "info");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 uppercase tracking-wider">
        Settings
      </h2>

      <Card title="Your Identity Keypair" className="mb-6">
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

        {keyPair && (
          <div className="mt-4 pt-4 border-t-3 border-pixel-border">
            {!showPrivateKeyInput ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPrivateKeyInput(true);
                  }}
                >
                  Load Existing NSEC Key
                </Button>
                <Button
                  variant="secondary"
                  className="text-pixel-warning hover:bg-red-200"
                  onClick={() => setShowClearConfirm(true)}
                >
                  Clear Current Keypair
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-normal text-pixel-text mb-1 uppercase tracking-wider">
                  Enter NSEC Private Key
                </label>
                <Input
                  type="password"
                  value={privateKeyInput}
                  onChange={(e) => {
                    setPrivateKeyInput(e.target.value);
                  }}
                  placeholder="Enter your nsec1... private key"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleLoadPrivateKey}
                    disabled={!privateKeyInput.startsWith("nsec1")}
                  >
                    Load Key
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowPrivateKeyInput(false);
                      setPrivateKeyInput("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <Link href="/" className="text-sm text-pixel-accent hover:underline">
        &lt;- Back to Home
      </Link>

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
