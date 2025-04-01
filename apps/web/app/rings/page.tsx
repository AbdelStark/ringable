"use client";

import * as React from "react";
import { Button, Card, Input } from "@repo/ui";
import { useRingStore } from "../../stores/useRingStore";
import { useUserStore } from "../../stores/useUserStore"; // To optionally add own key
import Link from "next/link";
import { type Ring } from "../../stores/types";

export default function RingsPage() {
  const { rings, addRing, updateRing, removeRing } = useRingStore();
  const { keyPair } = useUserStore(); // Get user's own keypair

  const [newRingName, setNewRingName] = React.useState("");
  const [editingRingId, setEditingRingId] = React.useState<string | null>(null);
  const [editRingName, setEditRingName] = React.useState("");
  const [editMembers, setEditMembers] = React.useState<string[]>([]);
  const [newMemberKey, setNewMemberKey] = React.useState("");

  const handleCreateRing = () => {
    if (newRingName.trim()) {
      addRing(newRingName.trim(), []);
      setNewRingName("");
    } else {
      alert("Please enter a name for the new ring.");
    }
  };

  const startEditing = (ring: Ring) => {
    setEditingRingId(ring.id);
    setEditRingName(ring.name);
    setEditMembers([...ring.memberPublicKeys]); // Clone members array
    setNewMemberKey("");
  };

  const cancelEditing = () => {
    setEditingRingId(null);
    setEditRingName("");
    setEditMembers([]);
    setNewMemberKey("");
  };

  const saveChanges = () => {
    if (!editingRingId) return;
    if (editRingName.trim() === "") {
      alert("Ring name cannot be empty.");
      return;
    }
    updateRing(editingRingId, { name: editRingName.trim(), memberPublicKeys: editMembers });
    cancelEditing();
  };

  const handleAddMember = (ringId: string, keyToAdd: string) => {
    if (!keyToAdd || keyToAdd.trim().length !== 64 || !/^[0-9a-fA-F]+$/.test(keyToAdd.trim())) {
      alert("Invalid public key format. Must be 64 hexadecimal characters.");
      return;
    }
    if (editMembers.includes(keyToAdd.trim())) {
      alert("Public key already in the ring.");
      return;
    }
    setEditMembers([...editMembers, keyToAdd.trim()]);
    setNewMemberKey(""); // Clear input after adding
  };

  const handleRemoveMember = (keyToRemove: string) => {
    setEditMembers(editMembers.filter(key => key !== keyToRemove));
  };

  const handleDeleteRing = (id: string) => {
    if (window.confirm("Are you sure you want to delete this ring?")) {
      removeRing(id);
      if (editingRingId === id) {
        cancelEditing();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold uppercase tracking-wider">Manage Rings</h2>
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
            onChange={(e) => { setNewRingName(e.target.value); }}
            className="flex-grow"
          />
          <Button onClick={handleCreateRing}>Create</Button>
        </div>
      </Card>

      {/* Existing Rings Section */}
      <h3 className="text-lg font-bold mb-3 uppercase tracking-wider">Your Rings</h3>
      {rings.length === 0 ? (
        <p className="text-sm text-gray-600">You haven't created any rings yet.</p>
      ) : (
        <div className="space-y-4">
          {rings.map((ring) => (
            <Card key={ring.id} className="relative">
              {editingRingId === ring.id ? (
                // Editing View
                <div className="space-y-3">
                  <Input
                    label="Ring Name"
                    value={editRingName}
                    onChange={(e) => { setEditRingName(e.target.value); }}
                  />
                  <div>
                    <label className="block text-xs font-normal text-pixel-text mb-1 uppercase tracking-wider">Members ({editMembers.length})</label>
                    {editMembers.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No members yet.</p>
                    ) : (
                      <ul className="list-none space-y-1 max-h-32 overflow-y-auto bg-white border-3 border-pixel-border p-2 mb-2">
                        {editMembers.map((key) => (
                          <li key={key} className="flex justify-between items-center text-xs break-all">
                            <span>{key}</span>
                            <Button
                              variant="secondary"
                              onClick={() => { handleRemoveMember(key); }}
                              className="text-red-500 hover:text-red-700 text-xs px-1 py-0 leading-none"
                              aria-label={`Remove ${key}`}
                            >
                              X
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-2 items-end">
                      <Input
                        label="Add Member Public Key"
                        placeholder="Enter 64-char hex public key..."
                        value={newMemberKey}
                        onChange={(e) => { setNewMemberKey(e.target.value); }}
                        maxLength={64}
                        className="flex-grow text-xs"
                      />
                      <Button variant="secondary" onClick={() => { handleAddMember(ring.id, newMemberKey); }} disabled={newMemberKey.length !== 64} className="shrink-0">
                        Add
                      </Button>
                    </div>
                    {keyPair && !editMembers.includes(keyPair.publicKeyHex) && (
                      <Button
                        variant="secondary"
                        onClick={() => { handleAddMember(ring.id, keyPair.publicKeyHex); }}
                        className="text-xs mt-2"
                      >
                        Add My Key ({keyPair.publicKeyHex.substring(0, 6)}...)
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2 pt-3 border-t-3 border-pixel-border">
                    <Button onClick={saveChanges}>Save Changes</Button>
                    <Button variant="secondary" onClick={cancelEditing}>Cancel</Button>
                  </div>
                </div>
              ) : (
                // Default View
                <div>
                  <h4 className="text-base font-normal mb-2 uppercase tracking-wider break-all">{ring.name}</h4>
                  <p className="text-xs mb-2">Members: {ring.memberPublicKeys.length}</p>
                  {/* Optional: List first few members */}
                  {/* {ring.memberPublicKeys.slice(0, 3).map(key => (
                    <p key={key} className="text-xs truncate">- {key}</p>
                  ))} */}
                  <div className="flex gap-2 mt-3">
                    <Button onClick={() => { startEditing(ring); }}>Edit</Button>
                    <Button variant="secondary" className="text-pixel-accent" onClick={() => { handleDeleteRing(ring.id); }}>
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 