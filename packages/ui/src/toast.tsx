import * as React from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose?: () => void;
  duration?: number; // in milliseconds, if undefined, toast won't auto-dismiss
}

export function Toast({
  message,
  type = "info",
  onClose,
  duration,
}: ToastProps): JSX.Element {
  React.useEffect(() => {
    if (duration && onClose) {
      const timeout = setTimeout(onClose, duration);
      return () => clearTimeout(timeout);
    }
  }, [duration, onClose]);

  // Different background colors based on toast type
  const typeStyles = {
    success: "bg-green-600 border-green-800",
    error: "bg-red-600 border-red-800",
    warning: "bg-yellow-500 border-yellow-700",
    info: "bg-pixel-accent border-pixel-accent-hover",
  };

  // Icon based on type (using ASCII for the retro feel)
  const typeIcon = {
    success: "✓",
    error: "✗",
    warning: "!",
    info: "i",
  };

  return (
    <div
      className={`w-full animate-bounce-in shadow-pixel ${typeStyles[type]} border-4 text-white p-3 flex items-start`}
      style={{ imageRendering: "pixelated" }}
    >
      <div className="mr-2 text-xl font-bold">{typeIcon[type]}</div>
      <div className="flex-1 text-sm uppercase tracking-wider break-words">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 text-lg leading-none font-bold"
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Animation for the toast
// Add this to your global CSS or to tailwind.config.js
// @keyframes bounceIn {
//   0% { transform: scale(0.5); opacity: 0; }
//   100% { transform: scale(1); opacity: 1; }
// }
// .animate-bounce-in {
//   animation: bounceIn 0.3s ease-out;
// }
