"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import { Check, Home } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { configurarTablaInscripcions } from "@/services/configurarTablaInscripcions"

// Componente de carga para usar como fallback
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

// Componente que usa useSearchParams y debe estar envuelto en Suspense
function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id") || "stripe_payment_completed"
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const saveInscription = async () => {
      try {
        // Recuperar los datos del formulario de localStorage
        const storedData = localStorage.getItem('inscripcionFormData')
        
        if (!storedData) {
          setError("No s'han trobat les dades necessàries per completar la inscripció")
          setIsLoading(false)
          return
        }
        
        // Decodificar los datos del formulario
        const formData = JSON.parse(storedData)
        
        // Limpiar los datos del localStorage una vez utilizados
        localStorage.removeItem('inscripcionFormData')
        
        // Verificar que los datos necesarios estén presentes
        if (!formData.playerName || !formData.email1) {
          throw new Error("Falten dades obligatòries al formulari")
        }

        // Guardar datos en Supabase
        await configurarTablaInscripcions()
        const supabase = createClientComponentClient()
        
        // Configurar datos para la inserción
        const insertData = {
          player_name: formData.playerName,
          birth_date: formData.birthDate,
          player_dni: formData.playerDNI,
          health_card: formData.healthCard,
          team: formData.team,
          parent_name: formData.parentName,
          contact_phone1: formData.contactPhone1,
          contact_phone2: formData.contactPhone2,
          alt_contact: formData.altContact,
          email1: formData.email1,
          email2: formData.email2,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          school: formData.school,
          shirt_size: formData.shirtSize,
          siblings_in_club: formData.siblingsInClub,
          seasons_in_club: formData.seasonsInClub,
          bank_account: formData.bankAccount,
          comments: formData.comments,
          accept_terms: formData.acceptTerms,
          payment_status: 'completed',
          payment_id: sessionId
        }

        // Inserción mediante función RPC para sortear RLS
        const { data, error } = await supabase.rpc('insert_inscripcio', {
          new_row: insertData,
        })

        if (error) {
          console.error('Error en inserción vía RPC:', error)
          throw new Error(error.message || error.details || 'Error desconegut')
        }

        console.log('Inscripción completada y guardada con éxito:', data)
        setSuccess(true)
      } catch (err: any) {
        console.error("Error al guardar la inscripción:", err)
        setError(`Hi ha hagut un error en processar la inscripció: ${err.message || 'Error desconegut'}. Si us plau, contacta amb el club.`)
      } finally {
        setIsLoading(false)
      }
    }

    saveInscription()
  }, [sessionId])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Processant la inscripció...</h2>
            <p className="text-gray-500 mt-2">Estem registrant les teves dades al nostre sistema.</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 font-bold text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Hi ha hagut un problema</h1>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <p className="text-gray-600 mb-8">
              Si el problema persisteix, contacta amb el club a través del correu 
              <a href="mailto:inscripcio@fccardedeu.cat" className="text-red-600 ml-1">
                inscripcio@fccardedeu.cat
              </a>
            </p>
            <Link 
              href="/inscripcio"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
            >
              Tornar al formulari
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Inscripció completada!</h1>
            <p className="text-gray-600 mb-6">
              El teu pagament s'ha processat correctament i la inscripció ha estat registrada al nostre sistema.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-medium text-blue-800 mb-2">Pròxims passos</h3>
              <ol className="list-decimal pl-5 text-sm text-blue-700 space-y-1">
                <li>Rebràs un correu electrònic amb tots els detalls</li>
                <li>L'equip tècnic es posarà en contacte amb tu</li>
                <li>Podràs començar a entrenar amb el teu equip</li>
              </ol>
            </div>
            
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
            >
              <Home className="mr-2 w-5 h-5" />
              Tornar a l'inici
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// Componente principal que envuelve SuccessContent en Suspense
export default function SuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingContent />}>
        <SuccessContent />
      </Suspense>
    </>
  )
}
