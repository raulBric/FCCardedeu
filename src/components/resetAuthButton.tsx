'use client';

import { useState } from 'react';

export default function ResetAuthButton() {
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resetAuth = async () => {
    setIsResetting(true);
    setMessage(null);
    
    try {
      // Limpiar todas las cookies relacionadas con Supabase
      const cookiesToClear = [
        'sb-access-token',
        'sb-refresh-token',
        'supabase-auth-token',
        'sb-provider-token',
        '__session',
        'supabase-auth-refresh-token',
        'sb-auth-token'
      ];
      
      cookiesToClear.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      // También limpiar localStorage
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      localStorage.removeItem('supabase.auth.provider_token');
      
      setMessage('Autenticación reiniciada correctamente. Redirigiendo...');
      
      // Redirigir al login después de un breve retraso
      setTimeout(() => {
        window.location.href = '/my-club';
      }, 1500);
    } catch (error) {
      console.error('Error al reiniciar autenticación:', error);
      setMessage('Error al reiniciar la autenticación. Intenta nuevamente.');
      setIsResetting(false);
    }
  };

  return (
    <div className="mt-4">
      {message && (
        <div className={`p-2 mb-3 text-sm rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <button
        onClick={resetAuth}
        disabled={isResetting}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        {isResetting ? 'Reiniciando...' : 'Reiniciar autenticación'}
      </button>
      <p className="text-xs text-gray-500 mt-1">
        Usa esto si tienes problemas con el inicio de sesión.
      </p>
    </div>
  );
}
