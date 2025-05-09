/**
 * Tests para el middleware de autenticación
 * 
 * Estos tests verifican que el middleware de autenticación funcione correctamente:
 * - Redireccionando a login cuando no hay sesión
 * - Permitiendo acceso cuando hay sesión válida
 * - Manejando errores correctamente
 */

import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '../../middleware';
import { createServerClient } from '@supabase/ssr';

// Mock de todas las dependencias
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      next: jest.fn().mockReturnValue({
        cookies: {
          set: jest.fn(),
          delete: jest.fn()
        }
      }),
      redirect: jest.fn().mockImplementation((url) => ({ 
        url, 
        cookies: { 
          set: jest.fn(),
          delete: jest.fn()
        } 
      }))
    }
  };
});

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn().mockReturnValue({
    auth: {
      getSession: jest.fn()
    }
  })
}));

describe('Auth Middleware', () => {
  // Configuración antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Función de ayuda para crear un mock NextRequest
  const createMockRequest = (path: string, cookies: Record<string, string> = {}) => {
    const headers = new Headers();
    headers.set('cookie', Object.entries(cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; '));
      
    return {
      headers,
      cookies: {
        get: (name: string) => cookies[name] ? { value: cookies[name] } : undefined
      },
      nextUrl: {
        pathname: path,
        searchParams: {
          set: jest.fn()
        }
      },
      url: `http://localhost${path}`
    } as unknown as NextRequest;
  };

  it('debe permitir acceso a rutas de dashboard cuando hay sesión', async () => {
    // Configurar una sesión válida
    const mockSession = { user: { id: '123', email: 'test@example.com' } };
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: mockSession }, error: null })
      }
    });
    
    const req = createMockRequest('/dashboard/usuarios');
    const response = await middleware(req);
    
    // Verificar que next() fue llamado (permite acceso)
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('debe redirigir al login cuando no hay sesión y la ruta es del dashboard', async () => {
    // Configurar que no hay sesión
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null })
      }
    });
    
    const req = createMockRequest('/dashboard/usuarios');
    const response = await middleware(req);
    
    // Verificar que redirige al login
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as jest.Mock).mock.calls[0][0];
    expect(redirectUrl.toString()).toContain('/my-club');
  });

  it('debe manejar cookies corruptas o en formato antiguo', async () => {
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null })
      }
    });
    
    // Crear request con cookies problemáticas
    const req = createMockRequest('/dashboard/usuarios', {
      'sb-access-token': 'base64-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      'supabase-auth-token': 'base64-corrupto'
    });
    
    await middleware(req);
    
    // Verificar que se eliminaron las cookies problemáticas
    const nextResponse = (NextResponse.next as jest.Mock).mock.results[0].value;
    expect(nextResponse.cookies.delete).toHaveBeenCalledWith('sb-access-token');
    expect(nextResponse.cookies.delete).toHaveBeenCalledWith('supabase-auth-token');
  });

  it('debe permitir acceso a rutas públicas sin importar estado de sesión', async () => {
    // Configurar que no hay sesión
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null })
      }
    });
    
    const req = createMockRequest('/equipo/juvenil');
    const response = await middleware(req);
    
    // Verificar que no redirige, permite acceso
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('debe manejar errores en getSession y redireccionar para rutas seguras', async () => {
    // Simular error al obtener la sesión
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockRejectedValue(new Error('Error de sesión'))
      }
    });
    
    const req = createMockRequest('/dashboard/usuarios');
    const response = await middleware(req);
    
    // Verificar que redirige al login en caso de error
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = (NextResponse.redirect as jest.Mock).mock.calls[0][0];
    expect(redirectUrl.toString()).toContain('/my-club');
  });
});

// Ayuda a TypeScript a reconocer este archivo como un módulo ES
export {};
