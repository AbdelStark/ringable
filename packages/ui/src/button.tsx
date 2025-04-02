import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary"; // Example variants
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps): JSX.Element {
  const baseStyles =
    "inline-flex items-center justify-center px-2 md:px-3 py-1 border-4 font-normal text-xs uppercase tracking-wider shadow-pixel active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pixel-accent disabled:opacity-75 disabled:cursor-not-allowed disabled:shadow-none disabled:active:translate-x-0 disabled:active:translate-y-0";

  const primaryStyles =
    "border-pixel-border bg-pixel-accent text-white hover:bg-pixel-accent-hover disabled:bg-pixel-disabled disabled:border-pixel-disabled disabled:text-white";
  const secondaryStyles =
    "border-pixel-border bg-pixel-container-bg text-pixel-text hover:bg-gray-200 disabled:bg-gray-100 disabled:border-pixel-disabled disabled:text-pixel-disabled";

  const variantStyles = variant === "primary" ? primaryStyles : secondaryStyles;

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
