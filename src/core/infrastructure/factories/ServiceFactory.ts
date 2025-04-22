import { InscripcionService } from '@/core/application/services/InscripcionService';
import { EquipoService } from '@/core/application/services/EquipoService';
import { JugadorService } from '@/core/application/services/JugadorService';
import { EntrenadorService } from '@/core/application/services/EntrenadorService';
import { NoticiaService } from '@/core/application/services/NoticiaService';
import { ResultadoService } from '@/core/application/services/ResultadoService';
import { PatrocinadorService } from '@/core/application/services/PatrocinadorService';

import { SupabaseInscripcionRepository } from '@/core/infrastructure/supabase/repositories/SupabaseInscripcionRepository';
import { SupabaseEquipoRepository } from '@/core/infrastructure/supabase/repositories/SupabaseEquipoRepository';
import { SupabaseJugadorRepository } from '@/core/infrastructure/supabase/repositories/SupabaseJugadorRepository';
import { SupabaseEntrenadorRepository } from '@/core/infrastructure/supabase/repositories/SupabaseEntrenadorRepository';
import { SupabaseNoticiaRepository } from '@/core/infrastructure/supabase/repositories/SupabaseNoticiaRepository';
import { SupabaseResultadoRepository } from '@/core/infrastructure/supabase/repositories/SupabaseResultadoRepository';
import { SupabasePatrocinadorRepository } from '@/core/infrastructure/supabase/repositories/SupabasePatrocinadorRepository';

// Singleton para obtener instancias de servicios
export class ServiceFactory {
  private static inscripcionService: InscripcionService;
  private static equipoService: EquipoService;
  private static jugadorService: JugadorService;
  private static entrenadorService: EntrenadorService;
  private static noticiaService: NoticiaService;
  private static resultadoService: ResultadoService;
  private static patrocinadorService: PatrocinadorService;

  // Obtener servicio de inscripciones
  public static getInscripcionService(): InscripcionService {
    if (!this.inscripcionService) {
      const repository = new SupabaseInscripcionRepository();
      this.inscripcionService = new InscripcionService(repository);
    }
    return this.inscripcionService;
  }

  // Obtener servicio de equipos
  public static getEquipoService(): EquipoService {
    if (!this.equipoService) {
      const repository = new SupabaseEquipoRepository();
      this.equipoService = new EquipoService(repository);
    }
    return this.equipoService;
  }

  // Obtener servicio de jugadores
  public static getJugadorService(): JugadorService {
    if (!this.jugadorService) {
      const repository = new SupabaseJugadorRepository();
      this.jugadorService = new JugadorService(repository);
    }
    return this.jugadorService;
  }

  // Obtener servicio de entrenadores
  public static getEntrenadorService(): EntrenadorService {
    if (!this.entrenadorService) {
      const repository = new SupabaseEntrenadorRepository();
      this.entrenadorService = new EntrenadorService(repository);
    }
    return this.entrenadorService;
  }

  // Obtener servicio de noticias
  public static getNoticiaService(): NoticiaService {
    if (!this.noticiaService) {
      const repository = new SupabaseNoticiaRepository();
      this.noticiaService = new NoticiaService(repository);
    }
    return this.noticiaService;
  }

  // Obtener servicio de resultados
  public static getResultadoService(): ResultadoService {
    if (!this.resultadoService) {
      const repository = new SupabaseResultadoRepository();
      this.resultadoService = new ResultadoService(repository);
    }
    return this.resultadoService;
  }

  // Obtener servicio de patrocinadores
  public static getPatrocinadorService(): PatrocinadorService {
    if (!this.patrocinadorService) {
      const repository = new SupabasePatrocinadorRepository();
      this.patrocinadorService = new PatrocinadorService(repository);
    }
    return this.patrocinadorService;
  }
}
