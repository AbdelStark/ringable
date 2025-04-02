import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({
  label,
  id,
  className,
  ...props
}: InputProps): JSX.Element {
  const inputId = id ?? React.useId();

  // Basic styles for input, focusing on border and removing default browser styles
  const inputStyles = `block w-full px-2 py-1 border-4 border-pixel-border bg-white text-pixel-text text-sm 
    focus:ring-2 focus:ring-offset-2 focus:ring-pixel-accent focus:border-pixel-accent focus:outline-none 
    disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-200 
    appearance-none`; // Remove default appearance

  return (
    <div className={`w-full ${props.type === "hidden" ? "hidden" : ""}`}>
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
        className={`${inputStyles} ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
