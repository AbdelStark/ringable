import * as React from "react";
import { Button } from "./button";

interface DuplicateVoteDialogProps {
  isOpen: boolean;
  keyImage: string;
  onClose: () => void;
}

export function DuplicateVoteDialog({
  isOpen,
  keyImage,
  onClose,
}: DuplicateVoteDialogProps): JSX.Element | null {
  const [showExplanation, setShowExplanation] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop/overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-bounce-in overflow-hidden">
        {/* Modal Content */}
        <div className="border-6 border-red-600 animate-blink-border bg-pixel-container-bg shadow-pixel-lg p-0">
          {/* Header */}
          <div className="bg-red-600 text-white px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-normal uppercase tracking-wider">
              Duplicate Vote Detected!
            </h2>
            <Button
              variant="secondary"
              onClick={onClose}
              className="p-1 text-white border-white hover:bg-red-700"
              aria-label="Close"
            >
              X
            </Button>
          </div>

          {/* Main content */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-center">
              <span className="text-5xl animate-pulse text-red-600">⚠️</span>
            </div>

            <p className="text-center text-sm font-bold">
              This key has already voted on this proposal.
            </p>

            <div className="mt-4 border-3 border-dashed border-red-400 bg-red-50 p-3">
              <p className="text-xs font-bold mb-1">KEY IMAGE:</p>
              <div className="bg-white p-2 border border-red-300 break-all text-xs font-mono overflow-x-auto">
                {keyImage}
              </div>
            </div>

            <div className="mt-3">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-xs text-pixel-accent hover:underline flex items-center"
              >
                <span className="mr-1">{showExplanation ? "▼" : "▶"}</span>
                {showExplanation ? "Hide Explanation" : "What is a Key Image?"}
              </button>

              {showExplanation && (
                <div className="mt-2 bg-gray-100 p-3 text-xs border-l-4 border-pixel-accent">
                  <p className="mb-2">
                    In bLSAG (Back's Linkable Spontaneous Anonymous Group), each
                    signer produces a unique key image derived from their
                    private key. This key image is the same for all signatures
                    produced by the same key, regardless of the message or the
                    ring.
                  </p>
                  <p className="mb-2">
                    This allows detecting when the same key signs multiple
                    messages, without revealing which specific key in the ring
                    is the signer.
                  </p>
                  <p>
                    Use cases include preventing double-voting, double-spending,
                    or enforcing one-time use credentials, while maintaining
                    anonymity within the group.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-4 py-3 flex justify-end">
            <Button onClick={onClose}>Dismiss</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
