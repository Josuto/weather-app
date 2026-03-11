import { Municipalities } from "@type/Municipalities";
import { Municipality } from "@type/Municipality";

export const MUNICIPALITY_ID_FORMAT = /^\d{5}$/;

export function fetchFromBrowserStorage(municipalityId: string): Municipality | null {
  if (!municipalityId || !MUNICIPALITY_ID_FORMAT.exec(municipalityId)) return null;
  const municipality = localStorage.getItem(`${municipalityId}`);
  return municipality ? JSON.parse(municipality) : null;
}

export function saveToBrowserStorage(municipality: Municipality): boolean {
  if (!municipality) throw Error("The given municipality is invalid");
  localStorage.setItem(municipality.id, JSON.stringify(municipality));
  return true;
}

export function removeFromBrowserStorage(municipalityId: string): boolean {
  if (!fetchFromBrowserStorage(municipalityId)) return false;
  localStorage.removeItem(`${municipalityId}`);
  return true;
}

export function fetchStoredMunicipalities(): Municipalities {
  const municipalities: Municipality[] = [];
  for (let i = 0, length = localStorage.length; i < length; i++) {
    const municipalityId = localStorage.key(i);
    if (municipalityId) {
      const municipality = fetchFromBrowserStorage(municipalityId);
      if (municipality) municipalities.push(municipality);
      // The alternative is not possible, so no need to throw any error here
    }
  }
  return new Municipalities(municipalities);
}
