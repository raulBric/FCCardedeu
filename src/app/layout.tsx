import Footer from "../components/Footer";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import type React from "react";
import { baseMetadata } from "@/lib/metadata";

const exo2 = Exo_2({ subsets: ["latin"] });

export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ca">
      <body className={exo2.className}>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
