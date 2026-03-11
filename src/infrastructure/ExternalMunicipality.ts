import { Municipality } from "@type/Municipality";

export type ExternalMunicipality = {
  id: string;
  nombre: string;
};

export function mapToMunicipalities(
  extMunicipalities: ExternalMunicipality[]
): Municipality[] {
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
  return {
    id: extMunicipality.id.substring(2), // Remove 'id' prefix
    name: extMunicipality.nombre.trim(), // Fixes trailing spaces like "Abadiño "
  };
}
