// Define el tipo de información de pago
export interface PaymentInfo {
  method: 'transfer' | 'card' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  date?: string;
  reference?: string;
  notes?: string;
}

// Define la entidad Inscripcion
export interface Inscripcion {
  id?: number;
  player_name: string;
  birth_date: string;
  player_dni: string;
  health_card?: string;
  team: string;
  parent_name: string;
  contact_phone1: string;
  contact_phone2?: string;
  alt_contact?: string;
  email1: string;
  email2?: string;
  address: string;
  city: string;
  postal_code: string;
  school?: string;
  shirt_size?: string;
  siblings_in_club?: string;
  seasons_in_club?: string;
  bank_account?: string;
  comments?: string;
  accept_terms: boolean;
  created_at?: string;
  estado?: 'pendiente' | 'completada' | 'rechazada';
  temporada?: string;
  processed?: boolean;
  payment_info?: PaymentInfo;
}

// DTO para crear una nueva inscripción
export interface CreateInscripcionDTO {
  playerName: string;
  birthDate: string;
  playerDNI: string;
  healthCard?: string;
  team: string;
  parentName: string;
  contactPhone1: string;
  contactPhone2?: string;
  altContact?: string;
  email1: string;
  email2?: string;
  address: string;
  city: string;
  postalCode: string;
  school?: string;
  shirtSize?: string;
  siblingsInClub?: string;
  seasonsInClub?: string;
  bankAccount?: string;
  comments?: string;
  acceptTerms: boolean;
}

// DTO para actualizar el estado de una inscripción
export interface UpdateInscripcionEstadoDTO {
  id: number;
  estado: 'pendiente' | 'completada' | 'rechazada';
  processed?: boolean;
  paymentInfo?: Partial<PaymentInfo>;
}
