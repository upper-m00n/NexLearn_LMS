import React from "react";


export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main>
        {children}
      </main>
  );
}