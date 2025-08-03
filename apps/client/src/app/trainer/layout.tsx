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
        <div className="flex min-h-screen">
          {/* Sidebar (fixed width) */}
          <div className="w-64 border-r">
            <AppSidebar />
          </div>

          {/* Main content (full remaining width) */}
          <main className="flex-1 min-w-0 p-6"> {/* Add min-w-0 to prevent flex overflow */}
            <SidebarTrigger />
            <div className="w-full"> {/* Ensure children take full width */}
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}