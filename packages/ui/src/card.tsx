import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export function Card({ title, children, className, ...props }: CardProps): JSX.Element {
  return (
    <div
      className={`border-3 border-pixel-border bg-pixel-container-bg shadow-pixel p-4 ${className ?? ""}`}
      {...props}
    >
      {title && (
        <h2 className="text-base font-normal border-b-3 border-pixel-border mb-3 pb-2 uppercase tracking-wider">
          {title}
        </h2>
      )}
      <div className="text-sm">
        {children}
      </div>
    </div>
  );
}
