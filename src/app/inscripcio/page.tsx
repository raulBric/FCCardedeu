"use client"

import type React from "react"

import { useState, type ChangeEvent, type FormEvent, useRef } from "react"
import Header from "@/components/Header"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, Check, CreditCard, AlertCircle, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

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
  shirtSize: string
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
    shirtSize: "",
    siblingsInClub: "",
    seasonsInClub: "",
    bankAccount: "",
    comments: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

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
      if (formData.playerDNI && !validateDNI(formData.playerDNI) && !validateNIE(formData.playerDNI)) {
        newErrors.playerDNI = "El DNI o NIE no és vàlid"
        isValid = false
      }
    }

    if (step === 2) {
      if (formData.email1 && !validateEmail(formData.email1)) {
        newErrors.email1 = "El correu electrònic no és vàlid"
        isValid = false
      }

      if (formData.email2 && !validateEmail(formData.email2)) {
        newErrors.email2 = "El correu electrònic no és vàlid"
        isValid = false
      }
    }

    if (step === 3) {
      if (formData.bankAccount) {
        const cleanIBAN = formData.bankAccount.replace(/\s/g, "").toUpperCase()
        if (!validateIBAN(cleanIBAN)) {
          newErrors.bankAccount = "El número IBAN no és vàlid"
          isValid = false
        }
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "Has d'acceptar les condicions per continuar"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validar el paso actual
    if (!validateStep(3)) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Usar conectar directamente con Supabase 
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
        accept_terms: formData.acceptTerms
      }
      
      // Intento directo con Supabase (recomendado revisar políticas RLS)
      let finalData = null
      let insertSuccess = false
      
      console.log('Intentando inserción directa a Supabase:', insertData)
      
      // Usar la opción de supabaseKey para asegurar que se use la clave anónima completa
      const { data, error } = await supabase
        .from('inscripcions')
        .insert([insertData])
        .select()
        
      if (error) {
        console.error('Error en inserción directa:', error)
        
        // Mostrar más detalles del error para facilitar la depuración
        const errorDetails = {
          code: error.code || 'N/A',
          message: error.message || 'Sin mensaje',
          details: error.details || 'Sin detalles',
          hint: error.hint || 'Sin pistas adicionales'
        }
        console.log('Detalles del error:', errorDetails)
        
        // Mensaje de error más descriptivo
        setSubmitError(`Hi ha hagut un error en enviar les dades: ${error.message || 'Error desconocido'}. Si us plau, contacta amb el club.`)
      } else {
        // Éxito
        finalData = data
        insertSuccess = true
        console.log('Inscripción creada exitosamente:', data)
      }
      
      // Procesar el resultado final
      if (insertSuccess) {
        console.log("Data inserted successfully:", finalData)
        setCurrentStep(4) // Mostrar confirmación
      }
    } catch (error: any) {
      console.error("Error:", error)
      // Mostrar detalles del error para facilitar la depuración
      const errorMessage = typeof error === 'object' ? 
        (error.message || JSON.stringify(error)) : 
        String(error);
      
      console.log('Error completo:', error);
      console.log('Mensaje de error:', errorMessage);
      
      setSubmitError(`Hi ha hagut un error en enviar les dades: ${errorMessage}. Si us plau, contacta amb el club.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    // Validar el paso actual antes de avanzar
    if (!validateStep(currentStep)) {
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
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowModal(false)
    }
  }

  // Estilo común para los selects
  const selectWrapperClass = "relative"
  const selectClass =
    "w-full p-3 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white cursor-pointer shadow-sm hover:border-red-300"

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-red-600">Formulari d'Inscripció</h1>

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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className={`w-full p-3 border ${errors.playerDNI ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent`}
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className={selectWrapperClass}>
                    <label className="block font-medium text-gray-700 mb-1">
                      EQUIP TEMPORADA 2024-2025 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="team"
                        value={formData.team}
                        onChange={handleChange}
                        className={selectClass}
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
                    <p className="text-xs text-gray-500 mt-1">Fes clic per seleccionar l'equip</p>
                  </div>
                  <div className={selectWrapperClass}>
                    <label className="block font-medium text-gray-700 mb-1">
                      TALLA DE SAMARRETA <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="shirtSize"
                        value={formData.shirtSize}
                        onChange={handleChange}
                        className={selectClass}
                        required
                      >
                        <option value="">Selecciona una talla</option>
                        <option value="6">6</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                      
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Fes clic per seleccionar la talla</p>
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      
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
                      className={`w-full p-3 border ${errors.email1 ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent`}
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                        className={selectClass}
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
                        className={selectClass}
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
                      placeholder="ES00 0000 0000 0000 0000 0000"
                      className={`w-full p-3 border ${errors.bankAccount ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      required
                    />
                    {errors.bankAccount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.bankAccount}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Aquest compte s'utilitzarà per a la domiciliació de les quotes del club.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">ALTRES DADES O COMENTARIS</label>
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
    <div className="flex items-center">
      <input
        id="acceptTerms"
        name="acceptTerms"
        type="checkbox"
        checked={formData.acceptTerms}
        onChange={(e) => handleChange(e as any)}
        className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-offset-0"
        required
      />
    </div>
    <div className="text-sm sm:text-base leading-5">
      <label htmlFor="acceptTerms" className="font-medium text-gray-700">
        Confirmo que he llegit i acceptat les{" "}
        <button
          type="button"
          className="text-red-600 underline hover:text-red-800"
          onClick={() => setShowModal(true)}
        >
          condicions d'inscripció
        </button>{" "}
        i la{" "}
        <button
          type="button"
          className="text-red-600 underline hover:text-red-800"
          onClick={() => setShowModal(true)}
        >
          política de protecció de dades
        </button>{" "}
        del FC Cardedeu. <span className="text-red-500">*</span>
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
                    En enviar aquest formulari, acceptes les condicions d'inscripció del FC Cardedeu per a la temporada
                    2024-2025. El pagament de la quota es realitzarà en un formulari separat al qual seràs redirigit
                    després d'enviar aquesta inscripció.
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

            {/* Paso 4: Confirmación */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Inscripció enviada!</h2>
                <p className="text-gray-600 mb-6">
                  Hem rebut correctament la teva sol·licitud d'inscripció. Per completar el procés, has de realitzar el
                  pagament de la quota.
                </p>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6 text-left">
                  <h3 className="font-medium text-blue-800 mb-2">Pròxims passos</h3>
                  <ol className="list-decimal pl-5 text-sm text-blue-700 space-y-1">
                    <li>Rebràs un correu electrònic de confirmació</li>
                    <li>Realitza el pagament mitjançant l'enllaç a continuació</li>
                    <li>Un cop confirmat el pagament, la inscripció estarà completa</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/pagament/demo"
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition flex items-center justify-center"
                  >
                    <CreditCard className="mr-2 w-5 h-5" /> Realitzar pagament ara
                  </Link>

                  <button
                    type="button"
                    onClick={() => (window.location.href = "/")}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition"
                  >
                    Tornar a l'inici
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>

      {/* Modal de términos y condiciones */}
      {showModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    onClick={handleClickOutside}
  >
    <div
      ref={modalRef}
      className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 sm:mx-4"
    >
      {/* Encabezado del modal */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-gray-100 rounded-t-lg">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center sm:text-left">
          Condicions d'inscripció i política de privacitat
        </h3>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={() => setShowModal(false)}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Contenido del modal */}
      <div className="p-4 sm:p-6">
        <div className="prose max-w-none text-sm sm:text-base">
          <h4 className="text-base sm:text-lg font-semibold mb-2">1. Condicions d'inscripció</h4>
          <p className="mb-4">
            En inscriure's al FC Cardedeu, el jugador i els seus tutors legals accepten les següents condicions:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Complir amb les normes internes del club.</li>
            <li>Assistir regularment als entrenaments i partits.</li>
            <li>Mantenir una actitud respectuosa amb companys, rivals, àrbitres i entrenadors.</li>
            <li>Abonar les quotes establertes en els terminis fixats.</li>
            <li>Participar en les activitats organitzades pel club.</li>
            <li>Cuidar el material i les instal·lacions del club.</li>
          </ul>

          <h4 className="text-base sm:text-lg font-semibold mb-2">2. Política de privacitat</h4>
          <p className="mb-4">
            D'acord amb el que estableix el <span className="font-bold">Reglament General de Protecció de Dades (RGPD)</span>, l'informem que les
            dades personals facilitades seran tractades per FC Cardedeu amb la finalitat de gestionar la
            inscripció i participació en les activitats del club.
          </p>
          <p className="mb-4">
            Les dades es conservaran mentre es mantingui la relació amb el club i no se sol·liciti la seva
            supressió. No es cediran a tercers excepte en els casos en què existeixi una obligació legal.
          </p>
          <p className="mb-4">
            Vostè té dret a obtenir confirmació sobre si a FC Cardedeu estem tractant les seves dades personals,
            per tant té dret a accedir a les seves dades personals, rectificar les dades inexactes o sol·licitar
            la seva supressió quan les dades ja no siguin necessàries.
          </p>

          <h4 className="text-base sm:text-lg font-semibold mb-2">3. Drets d'imatge</h4>
          <p className="mb-4">
            Amb la inscripció, s'autoritza al FC Cardedeu a utilitzar les imatges captades durant les activitats
            del club per a finalitats divulgatives en els canals oficials del club (web, xarxes socials,
            publicacions, etc.).
          </p>

          <h4 className="text-base sm:text-lg font-semibold mb-2">4. Quotes i pagaments</h4>
          <p className="mb-4">
            La inscripció al club implica el compromís de pagament de les quotes establertes. El no pagament de
            les quotes pot suposar la baixa del jugador.
          </p>
          <p className="mb-4">
            Les quotes es cobraran mitjançant domiciliació bancària en els terminis establerts pel club.
          </p>

          <h4 className="text-base sm:text-lg font-semibold mb-2">5. Acceptació</h4>
          <p>La inscripció al FC Cardedeu suposa l'acceptació d'aquestes condicions i normes del club.</p>
        </div>
      </div>

      {/* Pie del modal */}
      <div className="border-t p-4 sm:p-6 flex justify-end bg-gray-100 rounded-b-lg">
        <button
          type="button"
          onClick={() => setShowModal(false)}
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

