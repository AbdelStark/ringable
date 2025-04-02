import * as React from "react";
import { Button } from "./button";

export interface Account {
  id: string;
  name: string;
  npub: string;
  color: string;
}

interface AccountSwitcherProps {
  accounts: Account[];
  activeAccountId: string | null;
  onSelectAccount: (id: string) => void;
  onCreateAccount: () => void;
}

export function AccountSwitcher({
  accounts,
  activeAccountId,
  onSelectAccount,
  onCreateAccount,
}: AccountSwitcherProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);

  const activeAccount = React.useMemo(
    () => accounts.find((acc) => acc.id === activeAccountId) || accounts[0],
    [accounts, activeAccountId]
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectAccount = (id: string) => {
    onSelectAccount(id);
    setIsOpen(false);
  };

  // Handle clicking outside to close dropdown
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Active Account Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-2 py-1.5 border-3 border-pixel-border bg-pixel-container-bg hover:bg-gray-100 rounded-none"
      >
        {activeAccount ? (
          <>
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: activeAccount.color }}
            ></div>
            <span className="text-xs font-mono truncate max-w-[100px]">
              {activeAccount.name || activeAccount.npub.substring(0, 10) + "..."}
            </span>
            <span className={`text-xs ml-1 ${isOpen ? "rotate-180" : ""}`}>▼</span>
          </>
        ) : (
          <>
            <div className="w-5 h-5 rounded-full bg-gray-300"></div>
            <span className="text-xs font-mono truncate max-w-[100px]">No Account</span>
            <span className={`text-xs ml-1 ${isOpen ? "rotate-180" : ""}`}>▼</span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 w-64 border-3 border-pixel-border bg-white shadow-pixel py-2 animate-bounce-in">
          <div className="max-h-60 overflow-y-auto px-2">
            {accounts.length === 0 ? (
              <p className="text-xs text-gray-500 px-3 py-2">No accounts found</p>
            ) : (
              <ul className="space-y-1.5">
                {accounts.map((account) => (
                  <li key={account.id}>
                    <button
                      onClick={() => handleSelectAccount(account.id)}
                      className={`w-full text-left py-2 px-3 flex items-center gap-2 border-2 ${
                        account.id === activeAccountId
                          ? "border-pixel-accent bg-blue-50"
                          : "border-transparent hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: account.color }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">
                          {account.name}
                        </p>
                        <p className="text-[10px] text-gray-600 font-mono truncate">
                          {account.npub.substring(0, 6)}...{account.npub.substring(account.npub.length - 4)}
                        </p>
                      </div>
                      {account.id === activeAccountId && (
                        <div className="text-pixel-accent text-xs">✓</div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-2 mt-2 border-t border-pixel-border px-2">
            <Button
              onClick={onCreateAccount}
              className="w-full text-xs justify-center"
              variant="secondary"
            >
              + Create New Account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 