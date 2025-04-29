import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient, SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

// Singleton para el cliente de Supabase
export class SupabaseClient {
  private static instance: SupabaseClient;
  private supabaseClient: SupabaseClientType;

  private constructor() {
    // Usamos el cliente de componente para el front-end
    this.supabaseClient = createClientComponentClient();
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

  // Cliente específico para el servidor (para usar en los API routes)
  public static createServerClient(supabaseUrl: string, supabaseKey: string) {
    return createClient(supabaseUrl, supabaseKey);
  }
}
