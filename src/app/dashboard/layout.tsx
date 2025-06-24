import { Exo_2 } from "next/font/google";
import "../globals.css";
import type React from "react";
import { baseMetadata } from "@/lib/metadata";
import Sidebar from "@/components/dashboard/Sidebar";

const exo2 = Exo_2({ subsets: ["latin"] });

export const metadata = baseMetadata;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ca">
      <body className={exo2.className}>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 transition-all duration-300 p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
