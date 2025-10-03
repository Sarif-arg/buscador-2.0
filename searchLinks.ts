
import type { SearchCriteria } from './types';

const BASE_URL = "https://almironpropiedades.com.ar/propiedades";

// Mappings from criteria IDs to URL slugs
const propertyTypeMap: { [key: string]: string } = {
  'casa': '/casas',
  'departamento': '/departamentos',
  'terreno': '/terrenos+o+lotes',
  'local': '/locales+comerciales',
  'galpon': '/galpones',
  'oficina': '/oficinas',
  'campo': '/campos',
};

const operationMap: { [key: string]: string } = {
  'alquiler': '/alquileres',
  'compra': '/venta',
};

const locationMap: { [key:string]: string } = {
  'capitan bermudez': '/Argentina-Santa+Fe-San+Lorenzo-Capitan+Bermudez',
  'san lorenzo': '/Argentina-Santa+Fe-San+Lorenzo-San+Lorenzo',
  'flb': '/Argentina-Santa+Fe-San+Lorenzo-Fray+Luis+Beltran',
  'ricardone': '/Argentina-Santa+Fe-San+Lorenzo-Ricardone',
  'rosario': '/Argentina-Santa+Fe-Rosario-Rosario',
  'granadero baigorria': '/Argentina-Santa+Fe-Rosario-Granadero-Baigorria',
  'ibarlucea': '/Argentina-Santa+Fe-Rosario-Ibarlucea',
};

const bedroomsMap: { [key: string]: string } = {
  'monoambiente': '/0-dormitorios',
  '1': '/1-dormitorios',
  '2': '/2-dormitorios',
  '3': '/3-dormitorios',
  '4+': '/4-dormitorios',
};

/**
 * Generates a search URL based on the user's criteria.
 * @param criteria - The filters of search selected by the user.
 * @returns The dynamically constructed search URL.
 */
export function getSearchUrl(criteria: SearchCriteria): string {
  let path = '';

  if (criteria.propertyType && propertyTypeMap[criteria.propertyType]) {
    path += propertyTypeMap[criteria.propertyType];
  }
  
  if (criteria.operation && operationMap[criteria.operation]) {
    path += operationMap[criteria.operation];
  }

  if (criteria.location && locationMap[criteria.location]) {
    path += locationMap[criteria.location];
  }

  if (criteria.bedrooms && bedroomsMap[criteria.bedrooms]) {
    path += bedroomsMap[criteria.bedrooms];
  }

  let finalUrl = `${BASE_URL}${path}`;
  
  // Append credit parameter if applicable
  if (criteria.isMortgageCredit) {
    finalUrl += '?suitable_for_credit=1';
  }

  return finalUrl;
}
