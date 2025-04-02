"use client";

import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";

export default function KeyTest() {
  const { keyPair, generateAndSetKeyPair, isLoadingKeyPair } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  const handleGenerateKey = async () => {
    try {
      setError(null);
      await generateAndSetKeyPair();
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error("Key generation error:", err);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Key Pair Testing</h2>

      <div className="mb-4">
        <button
          onClick={handleGenerateKey}
          disabled={isLoadingKeyPair}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoadingKeyPair ? "Generating..." : "Generate Key Pair"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {keyPair && (
        <div className="space-y-2">
          <h3 className="font-semibold">Generated Key Pair:</h3>
          <div className="bg-gray-100 p-2 rounded overflow-auto">
            <p className="text-sm mb-1">
              <span className="font-mono">Public Key:</span>
            </p>
            <p className="font-mono text-xs break-all">
              {keyPair.publicKeyHex}
            </p>
          </div>
          <div className="bg-gray-100 p-2 rounded overflow-auto">
            <p className="text-sm mb-1">
              <span className="font-mono">Private Key:</span>
            </p>
            <p className="font-mono text-xs break-all">
              {keyPair.privateKeyHex}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
