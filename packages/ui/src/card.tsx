import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export function Card({
  title,
  children,
  className,
  ...props
}: CardProps): JSX.Element {
  return (
    <div
      className={`border-4 border-pixel-border bg-pixel-container-bg shadow-pixel p-3 ${
        className ?? ""
      }`}
      {...props}
    >
      {title && (
        <div className="bg-pixel-border text-white -m-3 mb-3 px-3 py-1">
          <h2 className="text-sm font-normal uppercase tracking-wider">
            {title}
          </h2>
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}
