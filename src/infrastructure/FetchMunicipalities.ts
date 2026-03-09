import { Municipality } from "@type/Municipality";
import { getInitialLink, decode, ExternalMunicipality } from "../app/api/helper";

const AEMET_MUNICIPALITIES_URL =
  "https://opendata.aemet.es/opendata/api/maestro/municipios";

export async function fetchMunicipalities(): Promise<Municipality[]> {
  try {
    const initialLink = await getInitialLink(AEMET_MUNICIPALITIES_URL);
    return await getMunicipalities(initialLink);
  } catch (error) {
    throw new Error(`Failed to fetch municipalities: ${error}`);
  }
}

async function getMunicipalities(url: string): Promise<Municipality[]> {
  let response;
  try {
    response = await fetch(url, {
      next: { revalidate: 1800 } /* 30 minutes in seconds*/,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Failed to fetch municipalities data: ${errorMessage}`);
  }

  if (!response.ok)
    throw new Error(`Failed to fetch municipalities data: ${response.statusText}`);

  const extMunicipalities = await decode(response);
  return mapToMunicipalities(extMunicipalities);
}

function mapToMunicipalities(extMunicipalities: ExternalMunicipality[]): Municipality[] {
  // Deduplicate and clean in one linear pass (O(n))
  const municipalityMap = new Map<string, Municipality>();
  extMunicipalities.forEach((extMunicipality: ExternalMunicipality) => {
    const municipalityKey = extMunicipality.nombre;
    if (!municipalityMap.has(municipalityKey)) {
      municipalityMap.set(municipalityKey, mapToMunicipality(extMunicipality));
    }
  });
  return Array.from(municipalityMap.values());
}

function mapToMunicipality(extMunicipality: ExternalMunicipality): Municipality {
  return new Municipality({
    id: extMunicipality.id.substring(2), // Remove 'id' prefix
    name: extMunicipality.nombre.trim(), // Fixes trailing spaces like "Abadiño "
  });
}
