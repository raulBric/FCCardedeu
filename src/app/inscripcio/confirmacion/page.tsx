export default function ConfirmacionInscripcion() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <div className="mx-auto h-16 w-16 text-green-500 flex items-center justify-center">
        <svg 
          className="w-12 h-12"
          fill="none" 
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold mt-4 mb-2">¡Inscripción Completada!</h1>
      
      <p className="text-gray-600 mb-6">
        Tu solicitud de inscripción ha sido recibida correctamente.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6 text-left">
        <p className="font-medium text-blue-800 mb-2">¿Qué sucederá ahora?</p>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>Revisaremos tu solicitud en los próximos días.</li>
          <li>Recibirás un email de confirmación a la dirección proporcionada.</li>
          <li>Te contactaremos para los siguientes pasos y formalizar la inscripción.</li>
        </ol>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        Gracias por confiar en FC Cardedeu.
      </p>
      
      <div className="mt-6">
        <a 
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}
