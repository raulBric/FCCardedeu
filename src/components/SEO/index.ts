// Exportamos todos los componentes Schema.org para facilitar su importación
export { default as SEOManager } from './SEOManager';
export { default as OrganizationSchema } from './OrganizationSchema';
export { default as TeamSchema } from './TeamSchema';
export { default as SportEventSchema } from './SportEventSchema';
export { default as NewsArticleSchema } from './NewsArticleSchema'; 
export { default as BreadcrumbSchema } from './BreadcrumbSchema';
export { default as SportFacilitySchema } from './SportFacilitySchema';
export { default as ContactPageSchema } from './ContactPageSchema';

// Exportamos los componentes OpenGraph
export {
  BaseOpenGraph,
  ArticleOpenGraph,
  EventOpenGraph,
  ProfileOpenGraph,
  OpenGraphManager
} from './OpenGraph';

// Tipos para usar con TypeScript
export type SEOType = 'organization' | 'team' | 'event' | 'news' | 'breadcrumb' | 'facility' | 'contact';
export type { OpenGraphType } from './OpenGraph';
