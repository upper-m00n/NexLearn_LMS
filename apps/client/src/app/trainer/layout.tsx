import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";


export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="p-4 bg-gray-100 border shadow-2xl">
        <h1 className="text-2xl font-bold text-black">Trainer Dashboard</h1>
      </header>
      <SidebarProvider>
        <AppSidebar/>
        <main className="p-6">
          <SidebarTrigger/>
          {children}</main>
      </SidebarProvider>
    </div>
  );
}
