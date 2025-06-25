export type Database = {
  public: {
    Tables: {
      convocatorias: {
        Row: {
          id: number
          created_at: string | null
          titulo: string | null
          fecha: string | null
          hora: string | null
          lugar: string | null
          equipo: string | null
          rival: string | null
          estado: string | null
          slug: string | null
          puntoencuentro: string | null
          horaencuentro: string | null
          notas: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          titulo?: string | null
          fecha?: string | null
          hora?: string | null
          lugar?: string | null
          equipo?: string | null
          rival?: string | null
          estado?: string | null
          slug?: string | null
          puntoencuentro?: string | null
          horaencuentro?: string | null
          notas?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          titulo?: string | null
          fecha?: string | null
          hora?: string | null
          lugar?: string | null
          equipo?: string | null
          rival?: string | null
          estado?: string | null
          slug?: string | null
          puntoencuentro?: string | null
          horaencuentro?: string | null
          notas?: string | null
        }
      },
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

