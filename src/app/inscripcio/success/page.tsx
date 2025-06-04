"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import { Check, Home } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Componente de carga para usar como fallback
function LoadingContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Carregant...</h2>
      </div>
    </div>
  )
}

// Componente que usa useSearchParams y debe estar envuelto en Suspense
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No s'ha trobat l'identificador de la sessió de pagament.");
      setIsLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const response = await fetch(`/api/verify-checkout-session?session_id=${sessionId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al verificar l'estat del pagament.");
        }
        const data = await response.json();
        setPaymentStatus(data.payment_status);
        setCustomerEmail(data.customer_email);

        if (data.payment_status === 'paid') {
          // Clear any form data from localStorage as it's now handled by webhook
          localStorage.removeItem('inscripcionFormData');
          localStorage.removeItem('pendingInscripcion'); 
        } else {
          setError("El pagament no s'ha completat correctament o està pendent.");
        }
      } catch (err: any) {
        console.error("Error verificant la sessió de pagament:", err);
        setError(`Hi ha hagut un error en verificar el pagament: ${err.message || 'Error desconegut'}. Si us plau, contacta amb el club.`);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg border border-gray-100"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-700">Processant la inscripció...</h2>
            <p className="text-gray-500 mt-3">Estem registrant les teves dades al nostre sistema.</p>
          </div>
        ) : error || (paymentStatus && paymentStatus !== 'paid') ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 font-bold text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Hi ha hagut un problema amb el pagament</h1>
            <p className="text-gray-600 mb-6">
              {error || "L'estat del pagament és: " + paymentStatus + ". Si creus que és un error, contacta amb el club."}
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-green-50 shadow-sm">
              <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Pagament Realitzat Correctament!</h1>
            <div className="h-1 w-16 bg-red-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 mb-6 text-lg">
              El teu pagament s'ha processat correctament. La inscripció s'ha registrat al nostre sistema.
            </p>
            {customerEmail && (
              <p className="text-sm text-gray-500 mb-6">
                S'ha enviat una confirmació al correu: {customerEmail}
              </p>
            )}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8 text-left max-w-md mx-auto shadow-sm">
              <h3 className="font-semibold text-blue-800 mb-3 text-lg flex items-center">
                <span className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-blue-700">i</span>
                Pròxims passos
              </h3>
              <ol className="list-decimal pl-6 text-sm text-blue-700 space-y-2.5">
                <li className="pb-1">Rebràs un correu electrònic de confirmació de la inscripció en breu (revisa la carpeta de correu brossa si no el veus).</li>
                <li className="pb-1">L'equip tècnic del club es posarà en contacte amb tu per als detalls sobre entrenaments i equip.</li>
                <li className="font-medium">Benvingut/da al FC Cardedeu! 🎉</li>
              </ol>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3.5 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-all transform hover:scale-105 shadow-md"
              >
                <Home className="mr-2 w-5 h-5" />
                Tornar a l'inici
              </Link>
              <Link 
                href="/inscripcio"
                className="inline-flex items-center px-6 py-3.5 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-all border border-gray-300"
              >
                Nova inscripció
              </Link>
            </div>
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
