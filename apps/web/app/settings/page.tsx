"use client";

import * as React from "react";
import { Button, Card, Input } from "@repo/ui";
import { useUserStore } from "../../stores/useUserStore";
import Link from "next/link"; // For navigation

export default function SettingsPage(): JSX.Element {
  const { keyPair, generateAndSetKeyPair, isLoadingKeyPair, setKeyPair } = useUserStore();
  const [copied, setCopied] = React.useState(false);
  const [showPrivateKeyInput, setShowPrivateKeyInput] = React.useState(false);
  const [privateKeyInput, setPrivateKeyInput] = React.useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy key.");
    });
  };

  const handleLoadPrivateKey = () => {
    if (privateKeyInput.length === 64 && /^[0-9a-fA-F]+$/.test(privateKeyInput)) {
      // Basic validation passed
      // In a real app, we would derive the public key and validate the pair
      console.warn("Loading private key - VALIDATION NEEDED");
      // For now, just set it (assuming crypto package could derive pubkey later)
      // Or ideally, use a crypto function `derivePublicKey(privateKey)`
      const mockPublicKey = "mock-pubkey-" + privateKeyInput.substring(0, 8);
      setKeyPair({ publicKeyHex: mockPublicKey, privateKeyHex: privateKeyInput });
      setShowPrivateKeyInput(false);
      setPrivateKeyInput("");
    } else {
      alert("Invalid private key format. Must be 64 hexadecimal characters.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 uppercase tracking-wider">Settings</h2>

      <Card title="Your Identity Keypair" className="mb-6">
        {keyPair ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-normal text-pixel-text mb-1 uppercase tracking-wider">Public Key</label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={keyPair.publicKeyHex}
                  className="bg-gray-100 text-xs flex-grow"
                />
                <Button variant="secondary" onClick={() => { handleCopy(keyPair.publicKeyHex); }} className="text-xs">
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            {/* Security Note: Only show private key actions for advanced users or development */}
            {/* In production, private key handling requires extreme care */}
            {/* <div className="pt-2 border-t border-pixel-border">
              <p className="text-xs text-pixel-text mt-2">Private Key: Handled securely (not shown).</p>
            </div> */}
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-sm">You don't have an identity keypair yet.</p>
            <Button
              onClick={generateAndSetKeyPair}
              disabled={isLoadingKeyPair}
            >
              {isLoadingKeyPair ? "Generating..." : "Generate New Keypair"}
            </Button>
          </div>
        )}

        {/* Option to load existing private key */} 
        {keyPair && (
          <div className="mt-4 pt-4 border-t-3 border-pixel-border">
            {!showPrivateKeyInput ? (
              <Button variant="secondary" onClick={() => { setShowPrivateKeyInput(true); }}>
                Load Existing Private Key
              </Button>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-normal text-pixel-text mb-1 uppercase tracking-wider">Enter 64-char Hex Private Key</label>
                <Input
                  type="password" // Hide input
                  value={privateKeyInput}
                  onChange={(e) => { setPrivateKeyInput(e.target.value); }}
                  maxLength={64}
                  placeholder="Enter your private key..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleLoadPrivateKey} disabled={privateKeyInput.length !== 64}>
                    Load Key
                  </Button>
                  <Button variant="secondary" onClick={() => { setShowPrivateKeyInput(false); setPrivateKeyInput(""); }}>
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
    </div>
  );
} 