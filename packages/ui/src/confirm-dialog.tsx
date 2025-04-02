import { Button } from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog box with pixel border */}
      <div
        className="relative z-10 border-6 border-pixel-border bg-pixel-container-bg shadow-pixel-lg p-0 max-w-md w-full mx-4 animate-bounce-in"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Dialog header */}
        <div className="bg-pixel-border text-white px-4 py-2">
          <h2 className="text-sm font-normal uppercase tracking-wider">
            {title}
          </h2>
        </div>

        {/* Dialog content */}
        <div className="p-4">
          <p className="text-sm mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
