import Header from "@/components/Header"
import Footer from "@/components/Footer"
// import AsistenteVirtual from "./components/AsistenteVirtual"
import { Exo_2 } from "next/font/google"
import "./globals.css"
import type React from "react"

const exo2 = Exo_2({ subsets: ["latin"] })

export const metadata = {
  title: "FC Cardedeu",
  description: "Sitio oficial del FC Cardedeu",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={exo2.className}>
        <div className="min-h-screen flex flex-col bg-club-secondary text-club-dark">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          {/* <AsistenteVirtual /> */}
        </div>
      </body>
    </html>
  )
}

