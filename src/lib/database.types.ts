export type Database = {
  public: {
    Tables: {
      inscripcions: {
        Row: {
          id: number
          player_name: string | null
          birth_date: string | null
          player_dni: string | null
          health_card: string | null
          team: string | null
          parent_name: string | null
          contact_phone1: string | null
          contact_phone2: string | null
          alt_contact: string | null
          email1: string | null
          email2: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          school: string | null
          shirt_size: string | null
          siblings_in_club: string | null
          seasons_in_club: string | null
          bank_account: string | null
          comments: string | null
        }
        Insert: {
          player_name?: string | null
          birth_date?: string | null
          player_dni?: string | null
          health_card?: string | null
          team?: string | null
          parent_name?: string | null
          contact_phone1?: string | null
          contact_phone2?: string | null
          alt_contact?: string | null
          email1?: string | null
          email2?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          school?: string | null
          shirt_size?: string | null
          siblings_in_club?: string | null
          seasons_in_club?: string | null
          bank_account?: string | null
          comments?: string | null
        }
        Update: {
          player_name?: string | null
          birth_date?: string | null
          player_dni?: string | null
          health_card?: string | null
          team?: string | null
          parent_name?: string | null
          contact_phone1?: string | null
          contact_phone2?: string | null
          alt_contact?: string | null
          email1?: string | null
          email2?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          school?: string | null
          shirt_size?: string | null
          siblings_in_club?: string | null
          seasons_in_club?: string | null
          bank_account?: string | null
          comments?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

