"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Escudo from "@/assets/Escudo.png"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (isHomePage) {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [isHomePage])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const menuItems = [
    { name: "Inici", path: "/" },
    { name: "Resultats", path: "/resultats" },
    { name: "Classificació", path: "/classificacio" },
    { name: "Notícies", path: "/noticies" },
    { name: "Comunitat", path: "/comunitat" },
    { name: "Primer Equip", path: "/primer-equip" },
    { name: "Futbol Base", path: "/futbol-base" },
    { name: "Convocatòries", path: "/convocatories" },
    { name: "Inscripció", path: "/inscripcio" },
    { name: "Pagaments", path: "/pagaments" },
    { name: "Junta Directiva", path: "/junta-directiva" },
  ]

  const headerClass = isHomePage
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-club-primary bg-opacity-100" : "bg-transparent"
      }`
    : "bg-club-primary"

  const menuVariants = {
    closed: { opacity: 0, y: "-100%" },
    open: { opacity: 1, y: 0 },
  }

  const containerVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  }

  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  }

  const transition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
  }

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-club-secondary">
            <Image
              src={Escudo}
              alt="FC Cardedeu"
              width={200}
              height={50}
              />
          </Link>
          <button
            className="text-club-secondary z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Tancar menú" : "Obrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-club-primary bg-opacity-95 z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={transition}
          >
            <nav className="h-full flex items-center justify-center">
              <motion.ul
                className="space-y-8 text-center"
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={transition}
              >
                {menuItems.map((item) => (
                  <motion.li key={item.name} variants={itemVariants} transition={transition}>
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                      <Link
                        href={item.path}
                        className="text-club-secondary transition-all duration-300 text-3xl font-bold hover:scale-110"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

