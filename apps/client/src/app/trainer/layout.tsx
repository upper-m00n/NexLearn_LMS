import React from "react";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
