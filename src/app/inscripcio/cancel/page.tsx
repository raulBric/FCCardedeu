"use client"

import Header from "@/components/Header"
import { X, Home, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Suspense } from "react"

// Componente de contenido
function CancelContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-md"
      >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Pagament cancel·lat</h1>
            <p className="text-gray-600 mb-6">
              Has cancel·lat el procés de pagament. La teva inscripció no s'ha processat.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-medium text-yellow-800 mb-2">Què vols fer ara?</h3>
              <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
                <li>Pots intentar realitzar el pagament de nou</li>
                <li>Pots contactar amb el club si necessites ajuda</li>
                <li>Pots tornar a l'inici i intentar-ho més tard</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/inscripcio"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Tornar al formulari
              </Link>
              
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition"
              >
                <Home className="mr-2 w-5 h-5" />
                Tornar a l'inici
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
  )
}

// Componente de carga
function LoadingContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Carregant...</h2>
      </div>
    </div>
  )
}

// Componente principal
export default function CancelPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingContent />}>
        <CancelContent />
      </Suspense>
    </>
  )
}
