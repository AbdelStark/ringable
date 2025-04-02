"use client";

import * as React from "react";
import { Button, Card, Input, useToast, ConfirmDialog, AccountSelectorDialog } from "@repo/ui";
import { useRingStore } from "../../stores/useRingStore";
import { useUserStore } from "../../stores/useUserStore"; // To optionally add own key
import { useAccountsStore } from "../../stores/useAccountsStore"; // Import accounts store
import Link from "next/link";
import { type Ring } from "../../stores/types";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk"; // Import NDK

// Add the truncateKey helper function
const truncateKey = (key: string): string => {
  if (!key || key.length < 15) return key;
  return `${key.substring(0, 8)}...${key.substring(key.length - 6)}`;
};

export default function RingsPage() {
  const { rings, addRing, updateRing, removeRing } = useRingStore();
  const { keyPair } = useUserStore(); // Get user's own keypair
  const { accounts } = useAccountsStore(); // Get accounts from the store
  const { addToast } = useToast(); // Use the toast hook

  const [newRingName, setNewRingName] = React.useState("");
  const [editingRingId, setEditingRingId] = React.useState<string | null>(null);
  const [editRingName, setEditRingName] = React.useState("");
  const [editMembers, setEditMembers] = React.useState<string[]>([]);
  const [newMemberKey, setNewMemberKey] = React.useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [ringToDelete, setRingToDelete] = React.useState<Ring | null>(null);

  // New state for generating member keys
  const [isGeneratingMemberKey, setIsGeneratingMemberKey] =
    React.useState(false);
  const [lastGeneratedNsec, setLastGeneratedNsec] = React.useState<
    string | null
  >(null);
  const [generatedKeyCopied, setGeneratedKeyCopied] = React.useState(false);

  // Add state for the account selector
  const [showAccountSelector, setShowAccountSelector] = React.useState(false);

  const handleCopy = (text: string, type: "npub" | "nsec" = "npub") => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (type === "nsec") {
          setGeneratedKeyCopied(true);
          addToast("Private key (nsec) copied! SAVE IT securely.", "warning");
          setTimeout(() => setGeneratedKeyCopied(false), 2000);
        } else {
          addToast("Public key copied.", "success", 1500);
          // Assuming simple copy feedback for npub if needed elsewhere
        }
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        addToast(
          `Failed to copy ${type === "nsec" ? "private key" : "key"}.`,
          "error",
        );
      });
  };

  const handleCreateRing = () => {
    if (newRingName.trim()) {
      addRing(newRingName.trim(), []);
      setNewRingName("");
      addToast(`Ring "${newRingName.trim()}" created successfully!`, "success");
    } else {
      addToast("Please enter a name for the new ring.", "error");
    }
  };

  const startEditing = (ring: Ring) => {
    setEditingRingId(ring.id);
    setEditRingName(ring.name);
    setEditMembers([...ring.memberPublicKeys]);
    setNewMemberKey("");
    setLastGeneratedNsec(null); // Clear generated key when starting edit
    setGeneratedKeyCopied(false);
  };

  const cancelEditing = () => {
    setEditingRingId(null);
    setEditRingName("");
    setEditMembers([]);
    setNewMemberKey("");
    setLastGeneratedNsec(null);
    setGeneratedKeyCopied(false);
  };

  const saveChanges = () => {
    if (!editingRingId) return;
    if (editRingName.trim() === "") {
      addToast("Ring name cannot be empty.", "error");
      return;
    }
    updateRing(editingRingId, {
      name: editRingName.trim(),
      memberPublicKeys: editMembers,
    });
    addToast(`Ring "${editRingName.trim()}" updated successfully!`, "success");
    cancelEditing();
  };

  const handleAddMember = (keyToAdd: string) => {
    const trimmedKey = keyToAdd.trim();
    if (
      !trimmedKey ||
      (!trimmedKey.startsWith("npub1") &&
        (trimmedKey.length !== 64 || !/^[0-9a-fA-F]+$/.test(trimmedKey)))
    ) {
      addToast(
        "Invalid public key format. Must be npub1... or 64 hex chars.",
        "error",
      );
      return;
    }
    if (editMembers.includes(trimmedKey)) {
      addToast("Public key already in the ring.", "warning");
      return;
    }
    setEditMembers([...editMembers, trimmedKey]);
    setNewMemberKey("");
    setLastGeneratedNsec(null); // Clear generated nsec display if manually adding
    addToast("Member added manually.", "success");
  };

  const handleRemoveMember = (keyToRemove: string) => {
    setEditMembers(editMembers.filter((key) => key !== keyToRemove));
  };

  const handleDeleteRing = (id: string) => {
    const ringToDelete = rings.find((ring) => ring.id === id);
    if (ringToDelete) {
      setRingToDelete(ringToDelete);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDeleteRing = () => {
    if (ringToDelete) {
      removeRing(ringToDelete.id);
      if (editingRingId === ringToDelete.id) {
        cancelEditing();
      }
      addToast(`Ring "${ringToDelete.name}" deleted.`, "info");
      setShowDeleteConfirm(false);
      setRingToDelete(null);
    }
  };

  const handleGenerateAndAddMember = async () => {
    setIsGeneratingMemberKey(true);
    setLastGeneratedNsec(null); // Clear previous one
    setGeneratedKeyCopied(false);
    try {
      const signer = NDKPrivateKeySigner.generate();
      const nsec = signer.nsec;
      const user = await signer.user();
      const npub = user.npub;

      if (!nsec || !npub) {
        throw new Error("Key generation failed.");
      }

      if (editMembers.includes(npub)) {
        addToast("Generated key already exists in this ring.", "warning");
      } else {
        setEditMembers([...editMembers, npub]);
        setLastGeneratedNsec(nsec);
        addToast(
          "New member key generated and added. SAVE the nsec below!",
          "success",
        );
      }
    } catch (error: any) {
      console.error("Failed to generate member key:", error);
      addToast(`Error generating key: ${error.message}`, "error");
    } finally {
      setIsGeneratingMemberKey(false);
    }
  };

  // Handle selecting an account from the selector
  const handleAddFromAccount = (npub: string) => {
    // Verify not already in ring
    if (editMembers.includes(npub)) {
      addToast("This account is already a member of the ring.", "warning");
      return;
    }
    
    setEditMembers([...editMembers, npub]);
    addToast("Account added to ring members.", "success");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Manage Rings
        </h2>
        <Link href="/" className="text-sm text-pixel-accent hover:underline">
          &lt;- Back to Home
        </Link>
      </div>

      {/* Create New Ring Section */}
      <Card title="Create New Ring" className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="New ring name..."
            value={newRingName}
            onChange={(e) => {
              setNewRingName(e.target.value);
            }}
            className="flex-grow"
          />
          <Button onClick={handleCreateRing}>Create</Button>
        </div>
      </Card>

      {/* Existing Rings Section */}
      <h3 className="text-lg font-bold mb-3 uppercase tracking-wider">
        Your Rings
      </h3>
      {rings.length === 0 ? (
        <p className="text-sm text-gray-600">
          You haven't created any rings yet.
        </p>
      ) : (
        <div className="space-y-4">
          {rings.map((ring) => (
            <Card key={ring.id} className="relative">
              {editingRingId === ring.id ? (
                // Editing View
                <div className="space-y-4">
                  <Input
                    label="Ring Name"
                    value={editRingName}
                    onChange={(e) => {
                      setEditRingName(e.target.value);
                    }}
                  />
                  <div>
                    <label className="block text-xs font-normal text-pixel-text mb-1 uppercase tracking-wider">
                      Members ({editMembers.length})
                    </label>
                    {editMembers.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">
                        No members yet.
                      </p>
                    ) : (
                      <ul className="list-none space-y-1 max-h-32 overflow-y-auto bg-white border-3 border-pixel-border p-2 mb-2">
                        {editMembers.map((key) => (
                          <li
                            key={key}
                            className="flex justify-between items-center text-xs break-all"
                          >
                            <span title={key}>{truncateKey(key)}</span>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                handleRemoveMember(key);
                              }}
                              className="text-red-500 hover:text-red-700 text-xs px-1 py-0 leading-none shrink-0 ml-2"
                              aria-label={`Remove ${key}`}
                            >
                              X
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-2 items-end mt-2">
                      <Input
                        label="Add Member NPUB"
                        placeholder="Enter Nostr Npub key..."
                        value={newMemberKey}
                        onChange={(e) => {
                          setNewMemberKey(e.target.value);
                        }}
                        maxLength={70}
                        className="flex-grow text-xs"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleAddMember(newMemberKey)}
                        disabled={
                          !newMemberKey.trim() ||
                          newMemberKey.trim().length < 60
                        }
                        className="shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-dashed border-pixel-border">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowAccountSelector(true)}
                        className="w-full text-xs justify-center"
                      >
                        Add from Your Accounts
                      </Button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-dashed border-pixel-border">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          void handleGenerateAndAddMember();
                        }}
                        disabled={isGeneratingMemberKey}
                      >
                        {isGeneratingMemberKey
                          ? "Generating..."
                          : "Generate New Member Key"}
                      </Button>
                      {lastGeneratedNsec && (
                        <div className="mt-2 p-2 border border-yellow-500 bg-yellow-50">
                          <p className="text-xs font-bold text-red-700 uppercase mb-1">
                            Save This Private Key (nsec)!
                          </p>
                          <p className="text-xs text-gray-700 mb-2">
                            This key provides access to vote as this new member.
                            It will not be shown again.
                          </p>
                          <div className="flex items-center gap-2">
                            <Input
                              readOnly
                              value={lastGeneratedNsec}
                              className="bg-gray-100 text-xs flex-grow"
                            />
                            <Button
                              variant="secondary"
                              onClick={() =>
                                handleCopy(lastGeneratedNsec, "nsec")
                              }
                              className="text-xs shrink-0"
                              disabled={generatedKeyCopied}
                            >
                              {generatedKeyCopied ? "Copied!" : "Copy NSEC"}
                            </Button>
                          </div>
                          <button
                            onClick={() => setLastGeneratedNsec(null)}
                            className="text-xs text-gray-500 hover:underline mt-2"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                    {keyPair && !editMembers.includes(keyPair.npub) && (
                      <div className="mt-3 pt-3 border-t border-dashed border-pixel-border">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleAddMember(keyPair.npub)}
                          className="text-xs"
                        >
                          Add My Key ({truncateKey(keyPair.npub)})
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-4 border-t-3 border-pixel-border mt-4">
                    <Button onClick={saveChanges}>Save Changes</Button>
                    <Button variant="secondary" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // Default View
                <div>
                  <h4 className="text-base font-normal mb-2 uppercase tracking-wider break-all">
                    {ring.name}
                  </h4>
                  <p className="text-xs mb-2">
                    Members: {ring.memberPublicKeys.length}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => {
                        startEditing(ring);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-pixel-warning hover:bg-red-200"
                      onClick={() => {
                        handleDeleteRing(ring.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add the AccountSelectorDialog */}
      <AccountSelectorDialog
        isOpen={showAccountSelector}
        accounts={accounts.map(acc => ({
          id: acc.id,
          name: acc.name,
          npub: acc.npub,
          color: acc.color
        }))}
        onClose={() => setShowAccountSelector(false)}
        onSelect={handleAddFromAccount}
        excludeNpubs={editMembers} // Exclude accounts already in the ring
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Ring"
        message={`Are you sure you want to delete the ring "${ringToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDeleteRing}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
