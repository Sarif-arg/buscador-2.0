import type { SearchCriteria } from './types';

/**
 * AQUÍ DEBES AÑADIR LOS ENLACES A TUS PÁGINAS DE RESULTADOS.
 * La estructura es anidada: operacion -> tipoDePropiedad -> localidad -> dormitorios.
 * Si una búsqueda no necesita un criterio (ej. un terreno no tiene dormitorios),
 * el enlace se coloca en el nivel anterior.
 * 
 * Ejemplo:
 * - Para Comprar > Terreno > Ibarlucea, el link se pone en SEARCH_URLS.compra.terreno.ibarlucea
 * - Para Comprar > Casa > Rosario > 2 Dormitorios, el link se pone en SEARCH_URLS.compra.casa.rosario['2']
 */
const SEARCH_URLS: Record<string, any> = {
  'compra': {
    'casa': {
      'rosario': {
        '1': 'https://www.almironpropiedades.com.ar/casas-en-venta-en-rosario-1-dormitorio',
        '2': 'https://www.almironpropiedades.com.ar/casas-en-venta-en-rosario-2-dormitorios',
        '3': 'https://www.almironpropiedades.com.ar/casas-en-venta-en-rosario-3-dormitorios',
      },
      'funes': {
        '2': 'https://www.almironpropiedades.com.ar/casas-en-venta-en-funes-2-dormitorios',
      }
    },
    'terreno': {
      'ibarlucea': 'https://www.almironpropiedades.com.ar/terrenos-en-venta-en-ibarlucea',
      'roldan': 'https://www.almironpropiedades.com.ar/terrenos-en-venta-en-roldan',
    }
  },
  'alquiler': {
    'departamento': {
      'rosario': {
        'monoambiente': 'https://www.almironpropiedades.com.ar/departamentos-en-alquiler-en-rosario-monoambiente',
        '1': 'https://www.almironpropiedades.com.ar/departamentos-en-alquiler-en-rosario-1-dormitorio',
      },
       'capitan bermudez': {
        '2': 'https://www.almironpropiedades.com.ar/departamentos-en-alquiler-en-cap-bermudez-2-dormitorios',
      }
    }
  }
};

// URL genérica si no se encuentra una coincidencia específica.
const FALLBACK_URL = 'https://www.almironpropiedades.com.ar/propiedades';

/**
 * Busca de forma segura en el objeto SEARCH_URLS la URL correspondiente a los criterios.
 * @param criteria - Los filtros de búsqueda seleccionados por el usuario.
 * @returns La URL específica o la URL de fallback.
 */
export function getSearchUrl(criteria: SearchCriteria): string {
  try {
    let currentLevel: any = SEARCH_URLS;

    if (criteria.operation) {
      currentLevel = currentLevel[criteria.operation];
    }
    if (criteria.propertyType) {
      currentLevel = currentLevel[criteria.propertyType];
    }
    if (criteria.location) {
      // Usamos el id de la localidad que puede tener espacios
      currentLevel = currentLevel[criteria.location];
    }
    if (criteria.bedrooms) {
      currentLevel = currentLevel[criteria.bedrooms];
    }

    // Si encontramos un string, es la URL. Si no, no hay coincidencia.
    return typeof currentLevel === 'string' ? currentLevel : FALLBACK_URL;
  } catch (error) {
    // Si en algún punto la clave no existe, se producirá un error.
    return FALLBACK_URL;
  }
}
