// DEPRECATED: Esta clase se mantiene sólo para compatibilidad con los repositorios
// existentes. Internamente delega en la nueva implementación oficial situada en
// `@/utils/supabase`. Cuando toda la base de código haya sido migrada, este
// archivo podrá eliminarse de forma segura.

import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

// Singleton para el cliente de Supabase
export class SupabaseClient {
  private static instance: SupabaseClient;
  private supabaseClient: SupabaseClientType;

  private constructor() {
    // Utilizamos la nueva fábrica oficial basada en @supabase/ssr
    this.supabaseClient = createBrowserClient();
  }

  public static getInstance(): SupabaseClient {
    if (!SupabaseClient.instance) {
      SupabaseClient.instance = new SupabaseClient();
    }
    return SupabaseClient.instance;
  }

  public getClient() {
    return this.supabaseClient;
  }

  /**
   * Cliente específico para entorno servidor (Route Handlers, Server Actions).
   * Internamente reutiliza la implementación de `utils/supabase/server` para
   * asegurar un único punto de acceso a la configuración de Supabase.
   */
  public static createServerClient() {
    // Garantizar que sólo se llama en entorno servidor
    if (typeof window !== 'undefined') {
      throw new Error('createServerClient sólo puede usarse en el servidor');
    }
    // Importación diferida para cumplir con la restricción de Next.js
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { cookies } = require('next/headers');
    return createServerSupabaseClient(cookies());
  }
}
