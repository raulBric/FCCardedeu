"use client"

import { useState, useEffect, useRef } from "react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import Damm from "@/assets/Patrocinadores/Adidas.png"

interface AdBannerProps {
  adUrl: string
  imageUrlMobile: StaticImageData | string
  imageUrlDesktop: StaticImageData | string
  altText: string
  sponsorName: string
}

export default function AdBanner({
  adUrl = "https://damm.com",
  imageUrlMobile = Damm,
  imageUrlDesktop = Damm,
  altText = "Anunci publicitari",
  sponsorName = "Damm",
}: AdBannerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <section ref={bannerRef} className="py-6 md:py-8 bg-gray-50 overflow-hidden flex justify-center">
      <div className="container mx-auto px-4 max-w-[80%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
          className="relative"
        >
          <div className="absolute top-0 left-0 bg-black/70 text-white text-xs px-2 py-1 z-10">Publicitat</div>

          <Link href={adUrl} target="_blank" rel="noopener noreferrer" className="block">
            <motion.div
              className="relative overflow-hidden rounded-lg shadow-lg"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full flex justify-center">
                {isMobile ? (
                  <div className="relative h-[180px] w-full">
                    <Image
                      key="mobile"
                      src={imageUrlMobile || "/placeholder.svg"}
                      alt={altText}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative h-[250px] w-full mx-auto flex justify-center">
                    <Image
                      key="desktop"
                      src={imageUrlDesktop || "/placeholder.svg"}
                      alt={altText}
                      fill
                      className="object-cover rounded-lg"
                      priority
                    />
                  </div>
                )}

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-700/20 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{sponsorName}</span>
                    <motion.div
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center text-sm"
                    >
                      Visitar <ExternalLink className="ml-1 h-4 w-4" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            // className="h-1 bg-gradient-to-r from-red-700 to-transparent mt-1 rounded-full"
          />
        </motion.div>
      </div>
    </section>
  )
}