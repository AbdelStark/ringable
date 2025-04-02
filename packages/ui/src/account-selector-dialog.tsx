import { Button } from "./button";
import { Account } from "./account-switcher";

interface AccountSelectorDialogProps {
  isOpen: boolean;
  accounts: Account[];
  onClose: () => void;
  onSelect: (npub: string) => void;
  excludeNpubs?: string[]; // NPubs to exclude from selection (already in ring)
}

export function AccountSelectorDialog({
  isOpen,
  accounts,
  onClose,
  onSelect,
  excludeNpubs = [],
}: AccountSelectorDialogProps): JSX.Element | null {
  if (!isOpen) return null;
  
  const availableAccounts = accounts.filter(
    account => !excludeNpubs.includes(account.npub)
  );

  const truncateKey = (key: string): string => {
    if (!key || key.length < 15) return key;
    return `${key.substring(0, 8)}...${key.substring(key.length - 6)}`;
  };

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
          <h2 className="text-lg font-normal uppercase tracking-wider">Select Account</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {availableAccounts.length === 0 ? (
          <p className="text-sm text-center py-4">
            {excludeNpubs.length === accounts.length 
              ? "All your accounts are already members of this ring." 
              : "You don't have any accounts to add."}
          </p>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            <p className="text-xs mb-3">Select an account to add to the ring:</p>
            
            <ul className="space-y-2">
              {availableAccounts.map(account => (
                <li key={account.id}>
                  <button
                    onClick={() => {
                      onSelect(account.npub);
                      onClose();
                    }}
                    className="w-full text-left py-2 px-3 flex items-center gap-2 border-2 border-transparent hover:bg-gray-100"
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: account.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">
                        {account.name}
                      </p>
                      <p className="text-[10px] text-gray-600 font-mono truncate">
                        {truncateKey(account.npub)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
} 