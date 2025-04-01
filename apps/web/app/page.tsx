"use client"; // Required for using hooks like useState or zustand stores

import { Button, Card } from "@repo/ui"; // Import our UI components
import { useUserStore } from "../stores/useUserStore"; // Import user store

export default function HomePage(): JSX.Element {
  const { keyPair, generateAndSetKeyPair, isLoadingKeyPair } = useUserStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-6">Welcome to Ringable!</h1>

      <Card title="Your Identity" className="mb-4 w-full max-w-md">
        {keyPair ? (
          <div>
            <p className="text-sm break-all">
              <strong>Public Key:</strong> {keyPair.publicKeyHex}
            </p>
            {/* In a real app, NEVER display the private key */}
            {/* <p className="text-sm break-all"><strong>Private Key:</strong> {keyPair.privateKeyHex}</p> */}
          </div>
        ) : (
          <p>No keypair generated yet.</p>
        )}
        <Button
          onClick={generateAndSetKeyPair}
          disabled={isLoadingKeyPair || !!keyPair}
          className="mt-4"
        >
          {isLoadingKeyPair
            ? "Generating..."
            : keyPair
              ? "Keypair Generated"
              : "Generate Keypair"}
        </Button>
      </Card>

      <p className="text-gray-600">
        This is the main page. We will list proposals here later.
      </p>

      {/* Example Button Usage */}
      <Button className="mt-8" onClick={() => { alert("Button clicked!"); }}>
        Test Button
      </Button>
    </div>
  );
}
