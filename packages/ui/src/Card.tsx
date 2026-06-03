import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export const Card = ({ children }: CardProps) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px"
      }}
    >
      {children}
    </div>
  );
};