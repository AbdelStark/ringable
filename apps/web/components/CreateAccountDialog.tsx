"use client";

import React, { useState } from 'react';
import { Button, Input } from "@repo/ui";

interface CreateAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: (name: string) => Promise<void>;
}

export function CreateAccountDialog({
  isOpen,
  onClose,
  onCreateAccount,
}: CreateAccountDialogProps) {
  const [accountName, setAccountName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountName.trim()) {
      return;
    }
    
    setIsCreating(true);
    try {
      await onCreateAccount(accountName.trim());
      setAccountName('');
    } catch (error) {
      console.error('Failed to create account:', error);
    } finally {
      setIsCreating(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div className="relative z-10 bg-white border-4 border-pixel-border shadow-pixel max-w-md w-full mx-4 p-4 animate-bounce-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-normal uppercase tracking-wider">Create New Account</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="e.g., Main Wallet, Anonymous Voter..."
            required
            className="mb-4"
          />
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !accountName.trim()}
            >
              {isCreating ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 