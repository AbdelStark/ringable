import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, className, ...props }: InputProps): JSX.Element {
  const inputId = id ?? React.useId();

  return (
    <div className={`w-full ${props.type === 'hidden' ? 'hidden' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-normal text-pixel-text mb-1 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`block w-full px-2 py-1 border-3 border-pixel-border bg-white text-pixel-text text-sm focus:ring-pixel-accent focus:border-pixel-accent focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-200 ${className ?? ""}`}
        {...props}
      />
    </div>
  );
} 