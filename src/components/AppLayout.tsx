import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto main-content">{children}</main>
    </div>
  );
}
