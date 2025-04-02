import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Card } from "./card";
import { Account } from "./account-switcher";

interface AccountManagerProps {
  accounts: Account[];
  activeAccountId: string | null;
  onSelectAccount: (id: string) => void;
  onCreateAccount: (name: string) => Promise<void>;
  onRenameAccount: (id: string, newName: string) => void;
  onDeleteAccount: (id: string) => void;
}

export function AccountManager({
  accounts,
  activeAccountId,
  onSelectAccount,
  onCreateAccount,
  onRenameAccount,
  onDeleteAccount,
}: AccountManagerProps): JSX.Element {
  const [newAccountName, setNewAccountName] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [editingAccountId, setEditingAccountId] = React.useState<string | null>(null);
  const [editAccountName, setEditAccountName] = React.useState("");
  
  const handleCreateAccount = async () => {
    if (!newAccountName.trim()) {
      alert("Please enter a name for the new account.");
      return;
    }
    
    setIsCreating(true);
    try {
      await onCreateAccount(newAccountName.trim());
      setNewAccountName("");
    } catch (error) {
      console.error("Failed to create account:", error);
      alert("Failed to create account. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  
  const startEditing = (account: Account) => {
    setEditingAccountId(account.id);
    setEditAccountName(account.name);
  };
  
  const cancelEditing = () => {
    setEditingAccountId(null);
    setEditAccountName("");
  };
  
  const saveAccountName = (accountId: string) => {
    if (editAccountName.trim()) {
      onRenameAccount(accountId, editAccountName.trim());
      cancelEditing();
    }
  };
  
  const handleDeleteAccount = (accountId: string) => {
    if (accounts.length <= 1) {
      alert("Cannot delete the only account. Create another account first.");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this account? This cannot be undone.")) {
      onDeleteAccount(accountId);
      if (editingAccountId === accountId) {
        cancelEditing();
      }
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Provide visual feedback (toast or alert)
  };

  return (
    <div className="space-y-6">
      <Card title="Create New Account">
        <div className="space-y-4">
          <Input
            label="Account Name"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            placeholder="e.g., Main Wallet, Anonymous Voter..."
          />
          <Button 
            onClick={handleCreateAccount}
            disabled={isCreating || !newAccountName.trim()}
          >
            {isCreating ? "Creating..." : "Create New Account"}
          </Button>
        </div>
      </Card>
      
      <Card title="Your Accounts">
        {accounts.length === 0 ? (
          <p className="text-sm text-gray-500">No accounts created yet.</p>
        ) : (
          <ul className="space-y-4">
            {accounts.map((account) => (
              <li 
                key={account.id} 
                className={`border-3 ${
                  account.id === activeAccountId 
                  ? "border-pixel-accent" 
                  : "border-gray-200"
                } p-3 relative`}
              >
                {editingAccountId === account.id ? (
                  // Editing Mode
                  <div className="space-y-3">
                    <Input
                      label="Account Name"
                      value={editAccountName}
                      onChange={(e) => setEditAccountName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => saveAccountName(account.id)}
                        disabled={!editAccountName.trim()}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: account.color }}
                      ></div>
                      <h3 className="font-bold text-sm">{account.name}</h3>
                      {account.id === activeAccountId && (
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      <div className="font-mono text-xs text-gray-600 flex-grow truncate">
                        {account.npub}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(account.npub)}
                        className="text-xs text-pixel-accent hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      {account.id !== activeAccountId && (
                        <Button 
                          onClick={() => onSelectAccount(account.id)}
                          variant="secondary"
                          className="text-xs"
                        >
                          Switch to This Account
                        </Button>
                      )}
                      <Button 
                        onClick={() => startEditing(account)}
                        variant="secondary"
                        className="text-xs"
                      >
                        Rename
                      </Button>
                      {accounts.length > 1 && (
                        <Button 
                          onClick={() => handleDeleteAccount(account.id)}
                          variant="secondary"
                          className="text-xs text-red-500 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
} 