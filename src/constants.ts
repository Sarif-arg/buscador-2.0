import type { StepOptionData } from './types';

export const PROPERTY_TYPES: StepOptionData[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'casa', label: 'Casa' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'terreno', label: 'Terreno' },
  { id: 'galpon', label: 'Galpón' },
  { id: 'local', label: 'Local Comercial' },
  { id: 'oficina', label: 'Oficina' },
  { id: 'campo', label: 'Campo'},
];

export const LOCATIONS: StepOptionData[] = [
  { id: 'rosario', label: 'Rosario' },
  { id: 'capitan bermudez', label: 'Cap. Bermúdez' },
  { id: 'flb', label: 'F. L. Beltrán' },
  { id: 'ibarlucea', label: 'Ibarlucea' },
  { id: 'granadero baigorria', label: 'Gdro. Baigorria' },
  { id: 'san lorenzo', label: 'San Lorenzo' },
  { id: 'funes', label: 'Funes' },
  { id: 'ricardone', label: 'Ricardone' },
];

export const BEDROOMS: StepOptionData[] = [
  { id: 'monoambiente', label: 'Monoambiente' },
  { id: '1', label: '1 Dormitorio' },
  { id: '2', label: '2 Dormitorios' },
  { id: '3', label: '3 Dormitorios' },
  { id: '4+', label: '4 o más' },
];