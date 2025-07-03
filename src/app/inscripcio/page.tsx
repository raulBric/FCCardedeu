"use client"

import type React from "react"

import { useState, type ChangeEvent, type FormEvent, useRef, useEffect } from "react"
import Header from "@/components/Header"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, Check, AlertCircle, X, CreditCard } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { configurarTablaInscripcions } from "@/services/configurarTablaInscripcions"
import { CheckoutForm } from "@/components/CheckoutForm"

// Este espacio se dejó intencionalmente vacío
// El componente StripePaymentForm ha sido reemplazado por CheckoutForm

interface FormData {
  playerName: string
  birthDate: string
  playerDNI: string
  healthCard: string
  team: string
  parentName: string
  contactPhone1: string
  contactPhone2: string
  altContact: string
  email1: string
  email2: string
  address: string
  city: string
  postalCode: string
  school: string
  siblingsInClub: string
  seasonsInClub: string
  bankAccount: string
  comments: string
  acceptTerms: boolean
}

interface FormErrors {
  playerDNI?: string
  email1?: string
  email2?: string
  bankAccount?: string
  acceptTerms?: string
  playerName?: string
  birthDate?: string
  healthCard?: string
  team?: string
  parentName?: string
  contactPhone1?: string
  contactPhone2?: string
  address?: string
  city?: string
  postalCode?: string
  school?: string
  siblingsInClub?: string
  seasonsInClub?: string
}

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    playerName: "",
    birthDate: "",
    playerDNI: "",
    healthCard: "",
    team: "",
    parentName: "",
    contactPhone1: "",
    contactPhone2: "",
    altContact: "",
    email1: "",
    email2: "",
    address: "",
    city: "",
    postalCode: "",
    school: "",
    siblingsInClub: "",
    seasonsInClub: "",
    bankAccount: "",
    comments: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showModalProteccion, setShowModalProteccion] = useState(false)
  const [showModalReglamento, setShowModalReglamento] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  // Estado para controlar si se ha intentado validar cada paso
  const [validationAttempted, setValidationAttempted] = useState<{[key: number]: boolean}>({1: false, 2: false, 3: false})
  const modalProteccionRef = useRef<HTMLDivElement>(null)
  const modalReglamentoRef = useRef<HTMLDivElement>(null)

  // Función para validar DNI español
  const validateDNI = (dni: string): boolean => {
    const dniRegex = /^[0-9]{8}[A-Z]$/
    const letterValues = "TRWAGMYFPDXBNJZSQVHLCKE"

    if (!dniRegex.test(dni)) {
      return false
    }

    const number = dni.substring(0, 8)
    const letter = dni.charAt(8)
    const calculatedLetter = letterValues.charAt(Number.parseInt(number) % 23)

    return letter === calculatedLetter
  }

  // Función para validar NIE (extranjeros)
  const validateNIE = (nie: string): boolean => {
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/
    const letterValues = "TRWAGMYFPDXBNJZSQVHLCKE"

    if (!nieRegex.test(nie)) {
      return false
    }

    const firstChar = nie.charAt(0)
    const number = nie.substring(1, 8)
    const letter = nie.charAt(8)

    // Reemplazar la letra inicial por su valor numérico
    let firstDigit = "0"
    if (firstChar === "X") firstDigit = "0"
    if (firstChar === "Y") firstDigit = "1"
    if (firstChar === "Z") firstDigit = "2"

    const calculatedLetter = letterValues.charAt(Number.parseInt(firstDigit + number) % 23)

    return letter === calculatedLetter
  }

  // Función para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Función para validar IBAN español
  const validateIBAN = (iban: string): boolean => {
    // Eliminar espacios y convertir a mayúsculas
    iban = iban.replace(/\s/g, "").toUpperCase()

    // Comprobar formato básico para IBAN español
    const ibanRegex = /^ES[0-9]{22}$/
    if (!ibanRegex.test(iban)) {
      return false
    }

    // Aquí se podría implementar la validación completa del IBAN
    // Para simplificar, solo verificamos el formato básico
    return true
  }
  
  // Función para validar fecha de nacimiento
  const validateBirthDate = (date: string): boolean => {
    // Verificar formato DD/MM/YYYY o YYYY-MM-DD
    const dateRegex1 = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
    const dateRegex2 = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/
    
    if (!dateRegex1.test(date) && !dateRegex2.test(date)) {
      return false
    }
    
    // Validar que la fecha sea real (no 31/02/2023 por ejemplo)
    let day, month, year
    
    if (dateRegex1.test(date)) {
      const parts = date.split(/[-\/.]/);
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1; // Meses en JS van de 0-11
      year = parseInt(parts[2], 10);
    } else {
      const parts = date.split(/[-\/.]/);
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    }
    
    const dateObj = new Date(year, month, day);
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month &&
      dateObj.getDate() === day &&
      dateObj.getFullYear() >= 1920 &&
      dateObj.getFullYear() <= new Date().getFullYear()
    );
  }
  
  // Función para validar número de teléfono español
  const validatePhone = (phone: string): boolean => {
    // Formato español: 9 dígitos, empezando por 6, 7, 8 o 9
    const phoneRegex = /^(6|7|8|9)\d{8}$/
    return phoneRegex.test(phone.replace(/\s+/g, ""))
  }
  
  // Función para validar código postal español
  const validatePostalCode = (postalCode: string): boolean => {
    // Códigos postales españoles: 5 dígitos, entre 01000 y 52999
    const postalCodeRegex = /^\d{5}$/
    if (!postalCodeRegex.test(postalCode)) {
      return false
    }
    
    const numericValue = parseInt(postalCode, 10)
    return numericValue >= 1000 && numericValue <= 52999
  }
  
  // Función para validar tarjeta sanitaria catalana/española
  const validateHealthCard = (healthCard: string): boolean => {
    // Formato simplificado para CatSalut (4 letras + 10 números) o tarjeta sanitaria española
    const cleanCard = healthCard.replace(/\s+/g, "")
    const catSalutRegex = /^[A-Z]{4}\d{10}$/
    const generalHealthCardRegex = /^\w{14,16}$/
    
    return catSalutRegex.test(cleanCard) || generalHealthCardRegex.test(cleanCard)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    // Manejar checkbox
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })

      // Limpiar error si se marca el checkbox
      if (checked && errors.acceptTerms) {
        setErrors({ ...errors, acceptTerms: undefined })
      }
      return
    }

    setFormData({ ...formData, [name]: value })

    // Validación en tiempo real para algunos campos
    if (name === "playerDNI" && value) {
      if (!validateDNI(value) && !validateNIE(value)) {
        setErrors({ ...errors, playerDNI: "El DNI o NIE no és vàlid" })
      } else {
        setErrors({ ...errors, playerDNI: undefined })
      }
    }

    if (name === "email1" && value) {
      if (!validateEmail(value)) {
        setErrors({ ...errors, email1: "El correu electrònic no és vàlid" })
      } else {
        setErrors({ ...errors, email1: undefined })
      }
    }

    if (name === "email2" && value) {
      if (!validateEmail(value)) {
        setErrors({ ...errors, email2: "El correu electrònic no és vàlid" })
      } else {
        setErrors({ ...errors, email2: undefined })
      }
    }

    if (name === "bankAccount" && value) {
      // Eliminar espacios para la validación
      const cleanIBAN = value.replace(/\s/g, "").toUpperCase()
      if (!validateIBAN(cleanIBAN)) {
        setErrors({ ...errors, bankAccount: "El número IBAN no és vàlid" })
      } else {
        setErrors({ ...errors, bankAccount: undefined })
      }
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (step === 1) {
      // Obligatorios
      if (!formData.playerName.trim()) {
        newErrors.playerName = "Aquest camp és obligatori"
        isValid = false
      } else if (formData.playerName.length < 2) {
        newErrors.playerName = "El nom ha de tenir almenys 2 caràcters"
        isValid = false
      }
      
      if (!formData.birthDate.trim()) {
        newErrors.birthDate = "Aquest camp és obligatori"
        isValid = false
      } else if (!validateBirthDate(formData.birthDate)) {
        newErrors.birthDate = "La data de naixement no és vàlida"
        isValid = false
      }
      
      if (!formData.playerDNI.trim()) {
        newErrors.playerDNI = "Aquest camp és obligatori"
        isValid = false
      } else if (!validateDNI(formData.playerDNI) && !validateNIE(formData.playerDNI)) {
        newErrors.playerDNI = "El DNI o NIE no és vàlid"
        isValid = false
      }
      
      if (!formData.healthCard.trim()) {
        newErrors.healthCard = "Aquest camp és obligatori"
        isValid = false
      } else if (!validateHealthCard(formData.healthCard)) {
        newErrors.healthCard = "El format de la targeta sanitària no és vàlid"
        isValid = false
      }
      
      if (!formData.team.trim()) {
        newErrors.team = "Aquest camp és obligatori"
        isValid = false
      }
    }

    if (step === 2) {
      if (!formData.parentName.trim()) {
        newErrors.parentName = "Aquest camp és obligatori"
        isValid = false
      } else if (formData.parentName.length < 2) {
        newErrors.parentName = "El nom ha de tenir almenys 2 caràcters"
        isValid = false
      }
      
      if (!formData.contactPhone1.trim()) {
        newErrors.contactPhone1 = "Aquest camp és obligatori"
        isValid = false
      } else if (!validatePhone(formData.contactPhone1)) {
        newErrors.contactPhone1 = "El número de telèfon no és vàlid"
        isValid = false
      }
      
      // Validar teléfono secundario si está presente
      if (formData.contactPhone2.trim() && !validatePhone(formData.contactPhone2)) {
        newErrors.contactPhone2 = "El número de telèfon no és vàlid"
        isValid = false
      }
      
      if (!formData.email1.trim()) {
        newErrors.email1 = "Aquest camp és obligatori"
        isValid = false
      } else if (!validateEmail(formData.email1)) {
        newErrors.email1 = "El correu electrònic no és vàlid"
        isValid = false
      }
      
      // email2 no es obligatorio, pero si se proporciona debe ser válido
      if (formData.email2 && !validateEmail(formData.email2)) {
        newErrors.email2 = "El correu electrònic no és vàlid"
        isValid = false
      }
      
      if (!formData.address.trim()) {
        newErrors.address = "Aquest camp és obligatori"
        isValid = false
      } else if (formData.address.length < 5) {
        newErrors.address = "L'adreça ha de tenir almenys 5 caràcters"
        isValid = false
      }
      
      if (!formData.city.trim()) {
        newErrors.city = "Aquest camp és obligatori"
        isValid = false
      } else if (formData.city.length < 2) {
        newErrors.city = "La població ha de tenir almenys 2 caràcters"
        isValid = false
      }
      
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = "Aquest camp és obligatori"
        isValid = false
      } else if (!validatePostalCode(formData.postalCode)) {
        newErrors.postalCode = "El codi postal no és vàlid"
        isValid = false
      }
    }

    if (step === 3) {
      if (!formData.school.trim()) {
        newErrors.school = "Aquest camp és obligatori"
        isValid = false
      } else if (formData.school.length < 2) {
        newErrors.school = "El nom de l'escola ha de tenir almenys 2 caràcters"
        isValid = false
      }
      
      if (!formData.siblingsInClub.trim()) {
        newErrors.siblingsInClub = "Aquest camp és obligatori"
        isValid = false
      }
      
      if (!formData.seasonsInClub.trim()) {
        newErrors.seasonsInClub = "Aquest camp és obligatori"
        isValid = false
      } else {
        const seasons = parseInt(formData.seasonsInClub);
        if (isNaN(seasons) || seasons < 0 || seasons > 20) {
          newErrors.seasonsInClub = "El número de temporades ha de ser entre 0 i 20"
          isValid = false
        }
      }
      
      if (!formData.bankAccount.trim()) {
        newErrors.bankAccount = "Aquest camp és obligatori"
        isValid = false
      } else {
        const cleanIBAN = formData.bankAccount.replace(/\s/g, "").toUpperCase()
        if (!validateIBAN(cleanIBAN)) {
          newErrors.bankAccount = "El número IBAN no és vàlid"
          isValid = false
        }
      }
      
      // comments no es obligatorio
      
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "Has d'acceptar les condicions per continuar"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Limpiar mensaje de error general
    setGeneralError(null)

    // Validar todos los pasos antes de enviar y marcar todos como intentados
    for (let i = 1; i <= 3; i++) {
      setValidationAttempted(prev => ({ ...prev, [i]: true }))
      if (!validateStep(i)) {
        setCurrentStep(i)
        setGeneralError('Hi ha camps obligatoris sense completar. Si us plau, revisa els camps marcats abans de continuar.')
        window.scrollTo(0, 0)
        return
      }
    }

    // Crear objeto de datos completo para la inscripción
    const inscripcionData = {
      playerName: formData.playerName,
      birthDate: formData.birthDate,
      playerDNI: formData.playerDNI,
      healthCard: formData.healthCard,
      team: formData.team,
      parentName: formData.parentName,
      contactPhone1: formData.contactPhone1,
      contactPhone2: formData.contactPhone2,
      altContact: formData.altContact,
      email1: formData.email1,
      email2: formData.email2,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      school: formData.school,

      siblingsInClub: formData.siblingsInClub,
      seasonsInClub: formData.seasonsInClub,
      bankAccount: formData.bankAccount,
      comments: formData.comments,
      acceptTerms: formData.acceptTerms,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    try {
      // Agregar campos específicos para el proceso de pago
      const inscripcionCompleta = {
        ...inscripcionData,
        payment_type: null,
        payment_amount: null,
        payment_status: 'pending',
        payment_session_id: null,
        last_updated: new Date().toISOString()
      };
      
      // Guardar la inscripción pendiente en localStorage (única fuente de verdad)
      console.log('Guardando datos de inscripción en localStorage');
      localStorage.setItem('pendingInscripcion', JSON.stringify(inscripcionCompleta));
      
      // Avanzar al paso de pago
      setCurrentStep(4);
      console.log('Formulario enviado correctamente, avanzando al paso de pago');
      
      // No establecemos isSubmitting en true aquí, solo cuando el usuario
      // decida hacer clic en el botón de pago en el paso 4
    } catch (error: any) {
      console.error("Error al procesar el formulario:", error);
      setSubmitError(
        `Hi ha hagut un error en processar el formulari: ${error.message || 'Error desconegut'}. Si us plau, contacta amb el club.`

      );
    }
  };

  const nextStep = () => {
    // Limpiar mensaje de error general antes de validar
    setGeneralError(null)
    
    // Marcar que se ha intentado validar este paso
    setValidationAttempted(prev => ({ ...prev, [currentStep]: true }))
    
    // Validar el paso actual antes de avanzar
    if (!validateStep(currentStep)) {
      // Mostrar mensaje general de error
      setGeneralError('Hi ha camps obligatoris sense completar. Si us plau, revisa els camps marcats abans de continuar.')
      // Desplazar la vista hacia arriba para que se vea el mensaje de error
      window.scrollTo(0, 0)
      return
    }

    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  const steps = ["Dades del jugador", "Informació de contacte", "Dades addicionals"]

  // Cerrar el modal si se hace clic fuera de él
  const handleClickOutsideProteccion = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalProteccionRef.current && !modalProteccionRef.current.contains(e.target as Node)) {
      setShowModalProteccion(false)
    }
  }

  const handleClickOutsideReglamento = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalReglamentoRef.current && !modalReglamentoRef.current.contains(e.target as Node)) {
      setShowModalReglamento(false)
    }
  }

  // Estilo común para los selects (igual que los inputs para consistencia visual)
  const selectWrapperClass = "relative"
  
  // Clase base para inputs y selects
  const baseClass = "w-full p-3 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
  
  // Función para generar clases de input con borde rojo solo si se ha intentado validar y hay error
  const getInputClass = (fieldName: keyof FormErrors) => {
    const showError = validationAttempted[currentStep] && errors[fieldName];
    return `${baseClass} ${showError ? 'border-red-500' : 'border-gray-300'}`
  }
  
  // Clase para selects
  const selectClass = baseClass

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-red-600">Formulari d&apos;Inscripció</h1>
          
          {/* Mensaje de error general */}
          {generalError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Barra de progreso */}
          {currentStep < 4 && (
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center ${
                      currentStep > index + 1
                        ? "text-green-600"
                        : currentStep === index + 1
                          ? "text-red-600"
                          : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        currentStep > index + 1
                          ? "border-green-600 bg-green-100"
                          : currentStep === index + 1
                            ? "border-red-600 bg-red-100"
                            : "border-gray-300"
                      }`}
                    >
                      {currentStep > index + 1 ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                    </div>
                    <span className="text-xs mt-1 hidden sm:block">{step}</span>
                  </div>
                ))}
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div
                  className="absolute h-2 bg-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep - 1) * 100) / 3}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Paso 1: Información del jugador */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Dades del jugador</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      NOM COMPLET DEL JUGADOR/A <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="playerName"
                      value={formData.playerName}
                      onChange={handleChange}
                      className={getInputClass("playerName")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      DATA DE NAIXEMENT <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className={getInputClass("birthDate")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      DNI DEL JUGADOR/A <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="playerDNI"
                      value={formData.playerDNI}
                      onChange={handleChange}
                      className={getInputClass("playerDNI")}
                      required
                    />
                    {errors.playerDNI && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.playerDNI}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Format: 12345678A (DNI) o X1234567A (NIE)</p>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      NÚMERO DE LA TARGETA SANITÀRIA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="healthCard"
                      value={formData.healthCard}
                      onChange={handleChange}
                      className={getInputClass("healthCard")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      EQUIP TEMPORADA 2025-2026 <span className="text-red-500">*</span>
                    </label>
                    <div className={selectWrapperClass}>
                      <select
                        name="team"
                        value={formData.team}
                        onChange={handleChange}
                        className={getInputClass("team")}
                        required
                      >
                        <option value="">Selecciona un equip</option>
                        <option value="prebenjami">Prebenjamí</option>
                        <option value="benjami">Benjamí</option>
                        <option value="alevi">Aleví</option>
                        <option value="infantil">Infantil</option>
                        <option value="cadet">Cadet</option>
                        <option value="juvenil">Juvenil</option>
                        <option value="amateur">Amateur</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Fes clic per seleccionar l&apos;equip</p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition flex items-center"
                  >
                    Següent <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Paso 2: Información de contacto */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Informació de contacte</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      NOM COMPLET DEL PARE/MARE <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      className={getInputClass("parentName")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      TELÈFON DE CONTACTE 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactPhone1"
                      value={formData.contactPhone1}
                      onChange={handleChange}
                      className={getInputClass("contactPhone1")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      TELÈFON DE CONTACTE 2 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactPhone2"
                      value={formData.contactPhone2}
                      onChange={handleChange}
                      className={baseClass + " border-gray-300"}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      CORREU ELECTRÒNIC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email1"
                      value={formData.email1}
                      onChange={handleChange}
                      className={getInputClass("email1")}
                      required
                    />
                    {errors.email1 && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.email1}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      ADREÇA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={getInputClass("address")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      POBLACIÓ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={getInputClass("city")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      CODI POSTAL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={getInputClass("postalCode")}
                      required
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition flex items-center"
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" /> Anterior
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition flex items-center"
                  >
                    Següent <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Paso 3: Información adicional */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Dades addicionals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      ESCOLA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      className={getInputClass("school")}
                      required
                    />
                  </div>
                  <div className={selectWrapperClass}>
                    <label className="block font-medium text-gray-700 mb-1">
                      GERMANS AL CLUB <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="siblingsInClub"
                        value={formData.siblingsInClub}
                        onChange={handleChange}
                        className={getInputClass("siblingsInClub")}
                        required
                      >
                        <option value="">Selecciona una opció</option>
                        <option value="0">Cap</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3+">3 o més</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Fes clic per seleccionar</p>
                  </div>
                  <div className={selectWrapperClass}>
                    <label className="block font-medium text-gray-700 mb-1">
                      TEMPORADES AL CLUB <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="seasonsInClub"
                        value={formData.seasonsInClub}
                        onChange={handleChange}
                        className={getInputClass("seasonsInClub")}
                        required
                      >
                        <option value="">Selecciona una opció</option>
                        <option value="0">Primera temporada</option>
                        <option value="1">1 temporada</option>
                        <option value="2">2 temporades</option>
                        <option value="3">3 temporades</option>
                        <option value="4+">4 o més temporades</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Fes clic per seleccionar</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      NÚMERO DE COMPTE BANCARI (IBAN) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      placeholder="ES91 2100 0418 4502 0005 1332"
                      className={getInputClass("bankAccount")}
                      required
                    />
                    {errors.bankAccount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.bankAccount}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Aquest compte s&apos;utilitzarà per a la domiciliació de les quotes del club.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">ALTRES DADES O COMENTARIS</label>
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      rows={4}
                      className={baseClass + " border-gray-300"}
                    />
                  </div>
                </div>

                {/* Checkbox para aceptar términos */}
                <div className="mt-6">
                  <div
                    className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 ${
                      errors.acceptTerms ? "border border-red-500 p-3 rounded-md bg-red-50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleChange(e as ChangeEvent<HTMLInputElement>)}
                        className={`h-4 w-4 text-red-600 focus:ring-red-500 rounded ${errors.acceptTerms ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                    </div>
                    <div className="text-sm sm:text-base leading-5">
                      <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                        <span className="text-red-500">☑</span> He llegit i accepto la 
                        <button
                          type="button"
                          className="text-red-600 underline hover:text-red-800"
                          onClick={() => setShowModalProteccion(true)}
                        >
                          política de protecció de dades i ús d'imatges
                        </button>{" "}
                        i el {" "}
                        <button
                          type="button"
                          className="text-red-600 underline hover:text-red-800"
                          onClick={() => setShowModalReglamento(true)}
                        >
                          reglament intern
                        </button>{" "}
                        del Club FUTBOL CLUB CARDEDEU, en compliment de la legislació vigent.
                        <span className="text-red-500">*</span>
                      </label>
                      {errors.acceptTerms && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" /> {errors.acceptTerms}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mt-6">
                  <h3 className="font-medium text-yellow-800 mb-2">Informació important</h3>
                  <p className="text-sm text-yellow-700">
                    En enviar aquest formulari, acceptes les condicions d&apos;inscripció del FC Cardedeu per a la temporada
                    2025-2026. El pagament de la quota es realitzarà en un formulari separat al qual seràs redirigit
                    després d&apos;enviar aquesta inscripció.
                  </p>
                </div>

                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                    <p className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" /> {submitError}
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition flex items-center"
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" /> Anterior
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition flex items-center disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processant...
                      </>
                    ) : (
                      "Enviar inscripció"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Paso 4: Formulario de pago con Stripe */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Últim pas: Realitzar pagament de la inscripció</h2>
                <p className="text-gray-600 mb-6 text-center">
                  Selecciona una opció de pagament per a completar la inscripció. Aquest pagament correspon únicament a la inscripció inicial.
                </p>
                <p className="text-sm text-orange-700 mb-6 text-center font-medium">
                  Les quotes mensuals de la temporada seran cobrades posteriorment segons les tarifes vigents del club.
                </p>

                
                <div className="max-w-md mx-auto bg-white p-4 rounded-lg">
                  <CheckoutForm 
                    email={formData.email1} 
                    playerDNI={formData.playerDNI}
                    setSubmitError={setSubmitError}
                    setIsPaying={() => {}}
                    isPaying={false}
                  />
                </div>
                
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/")}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition"
                  >
                    Tornar a l&apos;inici
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>

      {/* Modal de protección de datos */}
      {showModalProteccion && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleClickOutsideProteccion}
        >
          <div
            ref={modalProteccionRef}
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 sm:mx-4"
          >
            {/* Encabezado del modal */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-gray-100 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center sm:text-left">
                Política de Protecció de Dades i Ús d'Imatges
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowModalProteccion(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-4 sm:p-6">
              <div className="prose max-w-none text-sm sm:text-base">
                <p className="mb-4">
                  En enviar aquest formulari, el/la jugador(a) o, en cas de ser menor d'edat, el seu pare/mare o tutor legal, declara el següent:
                </p>
                
                <h4 className="text-base sm:text-lg font-semibold mb-2">Protecció de Dades Personals (RGPD i LOPDGDD):</h4>
                <p className="mb-4">
                  De conformitat amb el que estableix el Reglament (UE) 2016/679 del Parlament Europeu i del Consell, de 27 d'abril de 2016, relatiu a la protecció de les persones físiques pel que fa al tractament de dades personals i a la lliure circulació d'aquestes dades (RGPD), i a la Llei Orgànica 3/2018, de 5 de desembre, de Protecció de Dades Personals i garantia dels drets digitals (LOPDGDD),
                  autoritzo el Club FUTBOL CLUB CARDEDEU al tractament de les dades personals meves —o del menor al meu càrrec— amb la finalitat de gestionar les activitats esportives, inscripcions, participació en competicions, comunicacions internes, cobertures d'assegurances, control sanitari i altres gestions derivades de l'activitat del club.
                </p>
                <p className="mb-4">
                  Les dades podran ser cedides a tercers quan sigui estrictament necessari per al desenvolupament de l'activitat esportiva (Federació Catalana de Futbol, asseguradores esportives, administracions públiques, etc.).
                </p>
                <p className="mb-4">
                  En qualsevol moment es podran exercir els drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat, mitjançant sol·licitud escrita adreçada a administracio@fccardedeu.org.
                </p>

                <h4 className="text-base sm:text-lg font-semibold mb-2">Autorització per a l'ús de la imatge (LO 1/1982):</h4>
                <p className="mb-4">
                  De conformitat amb la Llei Orgànica 1/1982, de 5 de maig, de protecció civil del dret a l'honor, a la intimitat personal i familiar i a la pròpia imatge,
                  autoritzo el Club FUTBOL CLUB CARDEDEU a captar i utilitzar imatges (fotografies i/o vídeos) del jugador o jugadora en el desenvolupament d'entrenaments, partits i altres esdeveniments organitzats pel club. Aquestes imatges podran ser utilitzades amb finalitats informatives i promocionals a la pàgina web del club, xarxes socials, publicacions internes i altres suports de comunicació relacionats amb l'activitat del club.
                </p>
                <p className="mb-4">
                  Aquesta autorització podrà ser revocada en qualsevol moment mitjançant comunicació expressa i per escrit a l'adreça de correu electrònic anteriorment esmentada.
                </p>

                <h4 className="text-base sm:text-lg font-semibold mb-2">Acceptació del Codi Ètic i Normes del Club:</h4>
                <p className="mb-4">
                  Declaro conèixer i acceptar el Codi Ètic del Club FUTBOL CLUB CARDEDEU, comprometent-me —o comprometent-me en nom del menor inscrit— a respectar els seus valors, normes de conducta, principis de respecte, convivència, joc net i col·laboració amb entrenadors, companys, àrbitres i altres agents implicats en l'activitat esportiva.
                </p>

                <h4 className="text-base sm:text-lg font-semibold mb-2">Acceptació general:</h4>
                <p className="mb-4">
                  He llegit i accepto la política de protecció de dades, l'ús d'imatges i el codi ètic del Club FUTBOL CLUB CARDEDEU, en compliment de la legislació vigent.
                </p>
              </div>
            </div>

            {/* Pie del modal */}
            <div className="border-t p-4 sm:p-6 flex justify-end bg-gray-100 rounded-b-lg">
              <button
                type="button"
                onClick={() => setShowModalProteccion(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition focus:outline-none"
              >
                Entès i accepto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal del reglamento interno */}
      {showModalReglamento && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleClickOutsideReglamento}
        >
          <div
            ref={modalReglamentoRef}
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 sm:mx-4"
          >
            {/* Encabezado del modal */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-gray-100 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center sm:text-left">
                Reglament Intern del Club
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowModalReglamento(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-4 sm:p-6">
              <div className="prose max-w-none text-sm sm:text-base">
                <p className="mb-4">
                  En enviar aquest formulari, el/la jugador(a) o, en cas de ser menor d'edat, el seu pare/mare o tutor legal, declara conèixer i acceptar el següent Reglament Intern del Club:
                </p>
                
                <div className="border border-gray-200 rounded p-4 mb-4 overflow-y-auto max-h-96">
                  <h5 className="font-semibold text-center mb-4">REGLAMENT DE RÈGIM INTERN FUTBOL CLUB CARDEDEU</h5>

                  <p className="font-semibold mt-4">ÍNDEX</p>
                  <p>ARTICLE I. OBJECTE</p>
                  <p>ARTICLE II. ÀMBIT D'APLICACIÓ</p>
                  <p>CAPÍTOL II. COMPOSICIÓ I ESTRUCTURA</p>
                  <p>ARTICLE III. PRINCIPIS D'ACTUACIÓ</p>
                  <p>ARTICLE IV. EL COORDINADOR</p>
                  <p>ARTICLE V. ENTRENADORS</p>
                  <p>ARTICLE VI. JUGADORS I EQUIPS</p>
                  <p>ARTICLE VII. PARES I MARES</p>
                  <p>CAPÍTOL III. INFRACCIONS</p>
                  <p>ARTICLE VIII. FALTES LLEUS</p>
                  <p>ARTICLE IX. FALTES GREUS</p>
                  <p>CAPÍTOL IV. SANCIONS</p>
                  <p>ARTICLE X. PROCEDIMENT SANCIONADOR</p>
                  <p>ARTICLE XI. SANCIONS</p>
                  <p>CAPÍTOL I. DISPOSICIONS GENERALS</p>
                  
                  <p className="font-semibold mt-4">ARTICLE I. OBJECTE</p>
                  <p>El present Reglament de Règim Intern té per objecte regular l'organització i funcionament del FUTBOL CLUB CARDEDEU (en endavant "EL CLUB"), dins del marc construït per la legislació esportiva vigent i amb subjecció plena a l'establert en el seu ideari.</p>
                  <p>Per això, qualsevol recomanació, norma, sanció o actuació emanada del Club, només té com a finalitat contribuir a l'adequada formació de la personalitat i els valors humans de tots i cadascun dels integrants d'aquesta, a través de l'esport que han escollit.</p>
                  
                  <p className="font-semibold mt-4">ARTICLE II. ÀMBIT D'APLICACIÓ</p>
                  <p>El present Reglament serà d'aplicació en els següents àmbits:</p>
                  <p>a) Personal:</p>
                  <p>2.1 Els esportistes inscrits en el Club des de la formalització de la seva inscripció fins a la seva baixa; així com pares, mares i tutors dels mateixos.</p>
                  <p>2.2. A tot el personal tècnic i auxiliar del Club i totes aquelles persones o entitats (col·laboradors, patrocinadors) que per qualsevol motiu i temporalment formin part del Club.</p>
                  <p>b) Espacial:</p>
                  <p>2.3. Les instal·lacions esportives pròpies del Club.</p>
                  <p>2.4. Qualsevol instal·lació esportiva, local, edifici o espai als quals es desplacin els components del Club en la seva totalitat o en part, bé sigui de manera esporàdica o habitual per realitzar les activitats esportives.</p>


                  <p className="font-semibold mt-4">CAPÍTOL II. COMPOSICIÓ I ESTRUCTURA</p>
                  <p>Per dur a terme aquest pla, el Club ha creat una estructura organitzativa composta per Junta Directiva, Coordinador Esportiu i Entrenadors que, basant-se en l'objecte fonamental anteriorment exposat i recolzant-se en una sèrie de procediments d'actuació, tenen al seu càrrec les següents responsabilitats bàsiques:</p>
                  <p>a) La formació tant tècnica i tàctica, com del caràcter esportiu, de tots els components dels equips al seu càrrec.</p>
                  <p>b) La gestió, seguiment i control d'equips i jugadors, en totes les categories i edats.</p>
                  <p>c) La representació del Club davant la Federació corresponent.</p>

                  <p className="font-semibold mt-4">ARTICLE III. PRINCIPIS D'ACTUACIÓ</p>
                  <p>a) La Junta Directiva vetllarà perquè les activitats del Club es desenvolupin d'acord amb el projecte (ideari) del mateix, amb l'objecte de fer possible l'efectiva realització dels fins previstos.</p>
                  <p>b) La Junta Directiva garantirà l'exercici dels drets reconeguts al Coordinador Esportiu, Entrenadors i Jugadors.</p>

                  <p className="font-semibold mt-4">ARTICLE IV. EL COORDINADOR</p>
                  <p>a) És elegit, o destituït, per acord de la Junta Directiva del Club i nomenat o cessat pel President.</p>
                  <p>b) Està obligat a complir les recomanacions i obligacions que li són assignades en el present Reglament, així com les que li fossin encomanades per la Junta Directiva del Club, així com executar els acords de la Junta Directiva en l'àmbit de la seva competència.</p>
                  <p>c) Té l'obligació de guardar les mateixes formes, respecte i compostura exigits a qualsevol altre component del Club en qualsevol situació.</p>
                  <p>d) Vetllarà pel respecte i compliment de les normes i reglament de les competicions en les quals estiguin inscrits els equips al seu càrrec.</p>
                  <p>e) Té la facultat de poder passar als jugadors d'un equip a un altre, per motius tècnic-esportius, fins i tot d'una categoria a una altra; a més de poder cessar en el seu càrrec qualsevol entrenador que no compleixi amb les seves responsabilitats, segons l'indicat en el present Reglament.</p>

                  <p className="font-semibold mt-4">ARTICLE V. ENTRENADORS</p>
                  <p>Els entrenadors són aquells membres del Club que exerceixen la funció docent en l'àmbit esportiu, i l'exercici dels quals s'orientarà a la realització dels fins educatius i esportius establerts en l'ideari del Club. Per la seva proximitat al jugador, constitueixen el nucli principal de la seva formació i gaudeixen de l'absoluta confiança tant del Coordinador, com de la Junta Directiva.</p>

                  <p className="font-semibold mt-4">ARTICLE VI. JUGADORS I EQUIPS</p>
                  <p>Els jugadors tenen les següents obligacions:</p>
                  <p>a) Assistir als entrenaments prèviament establerts, esforçant-se i obligant-se a aprendre i millorar en tots els aspectes.</p>
                  <p>b) Els jugadors hauran d'estar completament equipats i preparats per donar començament l'entrenament amb rigorosa puntualitat, estant prohibit portar arracades, pírcings, pendents i similars.</p>
                  <p>c) Assistir a tots els partits als quals siguin convocats i amb l'antelació determinada per l'entrenador, amb l'equipament esportiu del Club, cuidant en tot moment el seu aspecte personal i la imatge del Club.</p>
                  <p>d) Justificar les absències als entrenaments i partits en aquells casos en els quals no pugui acudir, havent-ho de comunicar al seu entrenador amb la deguda antelació (un mínim de dos dies a la celebració de l'entrenament o partit), excepte causes de força major.</p>
                  <p>e) Cuidar el material esportiu del Club i les seves instal·lacions fent un ús adequat i correcte dels mateixos.</p>
                  <p>f) Comportar-se amb correcció i respecte en els entrenaments, partits, amb altres jugadors, companys, àrbitres, entrenadors i qualsevol altra persona relacionada amb el Club i no abandonar la banqueta després de ser substituït excepte permís de l'entrenador.</p>
                  <p>g) Comprometre's al desenvolupament de l'activitat esportiva durant tota la temporada, sense perjudicar els interessos esportius del Club.</p>
                  <p>h) Complir amb respecte les normes i reglament de les competicions en les quals estiguin inscrits.</p>

                  <p className="font-semibold mt-4">ARTICLE VII. PARES I MARES</p>
                  <p>Obligacions dels Pares i Mares:</p>
                  <p>a) Al principi de cada temporada, facilitaran les dades identificatives, administratives i autoritzacions pertinents que el Club els sol·liciti. Es responsabilitzaran que la documentació sol·licitada pel Club estigui vigent i de lliurar-la en els terminis estipulats.</p>
                  <p>b) Té l'obligació de guardar les mateixes formes, respecte i compostura exigits a qualsevol altre component del Club en qualsevol situació.</p>
                  <p>c) Durant el desenvolupament dels entrenaments o partits, inclosos els descansos, s'abstindran en tot moment d'aconsellar o recomanar, tant als jugadors com als entrenadors, accions que siguin competència exclusiva de l'entrenador.</p>
                  <p>d) Es comprometen a efectuar els pagaments acordats i requerits pel Club en la forma i terminis establerts. La devolució de qualsevol d'aquests pagaments suposa la retirada de la fitxa, per part de la Junta Directiva, fins al seu pagament amb els càrrecs corresponents (interessos).</p>
                  
                  <p>Drets dels Pares i Mares:</p>
                  <p>a) Tots els Pares i Mares tenen dret a que es respecti la seva integritat física, moral i la seva dignitat personal, no podent ser objecte de vexacions físiques o morals.</p>

                  <p className="font-semibold mt-4">CAPÍTOL III. INFRACCIONS</p>
                  <p>La present normativa serà d'aplicació a tots els jugadors del Club. La Junta Directiva, el Coordinador Esportiu i els Entrenadors, posaran especial cura en la prevenció de les actuacions disciplinàries presents en aquesta normativa, mitjançant el contacte i col·laboració constant. Sense perjudici d'accions posteriors, els Entrenadors podran adoptar les mesures que considerin pertinents per mantenir l'ordre dins de l'equip, comunicant-ho amb posterioritat al Coordinador.</p>

                  <p className="font-semibold mt-4">ARTICLE VIII. FALTES LLEUS</p>
                  <p>Són faltes lleus:</p>
                  <p>a) Faltes injustificades de puntualitat a entrenaments i partits.</p>
                  <p>b) Actitud passiva en entrenaments i partits.</p>
                  <p>c) Falta de respecte a companys i rivals, entrenadors, àrbitres i personal del Club o de les instal·lacions en les quals es realitzen les activitats esportives, pròpies i alienes.</p>
                  <p>d) Actes d'indisciplina, injúria o ofensa no greus.</p>
                  <p>e) Qualsevol acte injustificat que alteri el normal desenvolupament de les activitats del Club.</p>

                  <p className="font-semibold mt-4">ARTICLE IX. FALTES GREUS</p>
                  <p>Són faltes greus:</p>
                  <p>a) Faltes injustificades reiterades d'assistència a entrenaments i partits.</p>
                  <p>b) Falta de respecte a companys i rivals, entrenadors, àrbitres i personal del Club o de les instal·lacions en les quals es realitzen les activitats esportives, pròpies i alienes; que es produeixin amb reiteració.</p>
                  <p>c) Actes d'indisciplina, injúria o ofensa greus als membres del Club.</p>
                  <p>d) L'agressió física a companys i rivals, entrenadors, àrbitres i personal del Club o de les instal·lacions en les quals es realitzen les activitats esportives, pròpies i alienes.</p>
                  <p>e) Qualsevol acte injustificat que alteri greument el normal desenvolupament de les activitats del Club.</p>
                  <p>f) La reiterada i sistemàtica comissió de faltes lleus en una mateixa temporada esportiva.</p>

                  <p className="font-semibold mt-4">CAPÍTOL IV. SANCIONS</p>

                  <p className="font-semibold mt-4">ARTICLE X. PROCEDIMENT SANCIONADOR</p>
                  <p>El Coordinador, per delegació de la Junta Directiva, serà l'encarregat d'establir les sancions per a les faltes classificades com lleus, donant compte d'això al President de la Junta Directiva i aquest al seu torn al Comitè de Disciplina, reunint-se urgentment a aquest efecte per ratificar si escau l'acordat pel Coordinador.</p>
                  <p>En el si de la Junta Directiva es podrà constituir un Comitè de Disciplina, al qual correspondrà, per delegació d'aquella, la resolució dels expedients incoats per la comissió de fets que puguin ser conceptuats com a falta greu. Aquest Comitè estarà compost pel President del Club o persona en qui delegui, i integrat pel Coordinador i dos membres de la Junta Directiva.</p>
                  <p>a) La instrucció de l'expedient haurà d'acordar-se en el menor termini possible i en tot cas no superar els deu dies, des que es tingui coneixement de la falta.</p>
                  <p>b) Posteriorment, es donarà audiència al jugador i, si és menor d'edat, als seus pares, comunicant-los les faltes que se li imputen i la proposta de sanció acordada per escrit.</p>
                  <p>c) En el moment de decidir la resolució de l'expedient disciplinari, i als efectes de graduar l'aplicació de les sancions que procedeixen, es tindran en compte les circumstàncies personals, familiars i socials del jugador.</p>
                  <p>d) La Junta Directiva, a proposta del Comitè de Disciplina podrà decidir l'arxiu i sobreseimiento de l'expedient sancionador quan concorrin circumstàncies que així ho aconsellin.</p>

                  <p className="font-semibold mt-4">ARTICLE XI. SANCIONS</p>
                  <p>Per la comissió de les faltes enumerades s'imposaran les següents sancions:</p>
                  <p>Per faltes lleus es podrà imposar alguna de les següents sancions atenent a les circumstàncies de cada cas:</p>
                  <p>a) Amonestació privada.</p>
                  <p>b) Amonestació escrita i que serà comunicada als pares.</p>
                  <p>c) Suspensió de la pràctica esportiva per un temps no superior a 8 dies.</p>
                  <p>Per faltes greus:</p>
                  <p>a) Apercebiment, en el cas de contínues faltes injustificades d'assistència, en el qual s'inclourà un informe detallat de l'entrenador corresponent i del Coordinador corresponent sobre aquesta actitud.</p>
                  <p>b) Pèrdua del dret a la pràctica esportiva per un període entre 30 dies i una temporada esportiva. La Junta Directiva podrà acordar la readmissió del jugador prèvia petició i comprovació d'un canvi positiu d'actitud.</p>
                </div>

                <h4 className="text-base sm:text-lg font-semibold mb-2">Acceptació del Reglament</h4>
                <p className="mb-4">
                  Declaro conèixer i acceptar el Reglament Intern i Codi Ètic del Club FUTBOL CLUB CARDEDEU, comprometent-me —o comprometent-me en nom del menor inscrit— a respectar els seus valors, normes de conducta, principis de respecte, convivència, joc net i col·laboració amb entrenadors, companys, àrbitres i altres agents implicats en l'activitat esportiva.
                </p>
              </div>
            </div>

            {/* Pie del modal */}
            <div className="border-t p-4 sm:p-6 flex justify-end bg-gray-100 rounded-b-lg">
              <button
                type="button"
                onClick={() => setShowModalReglamento(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition focus:outline-none"
              >
                Entès i accepto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
