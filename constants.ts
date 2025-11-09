export const SUGGESTED_TAGS: string[] = [
  'fondo corporativo',
  'tono azul profesional',
  'retrato en oficina',
  'tecnología',
  'creatividad',
  'liderazgo',
  'diversidad',
  'innovación',
  'trabajo en equipo',
  'minimalista',
];

export const LOADING_MESSAGES: string[] = [
  'Generando tus imágenes...',
  'Inspirando tu próxima publicación...',
  'Creando visuales impactantes...',
  'Un momento, la magia está sucediendo...',
  'Pulimos los últimos detalles...',
];

export interface StyleOption {
  id: string;
  name: string;
  promptValue: string;
}

export const PREDEFINED_STYLES: StyleOption[] = [
  { id: 'photographic', name: 'Fotográfico', promptValue: 'estilo fotográfico realista' },
  { id: 'illustration', name: 'Ilustración', promptValue: 'estilo ilustración digital' },
  { id: 'minimalist', name: 'Minimalista', promptValue: 'estilo minimalista y limpio' },
  { id: 'corporate', name: 'Corporativo', promptValue: 'estilo corporativo y profesional' },
  { id: 'modern', name: 'Moderno', promptValue: 'estilo de diseño moderno' },
  { id: 'abstract', name: 'Abstracto', promptValue: 'estilo abstracto y artístico' },
];