import { Municipality } from "@type/Municipality";

export const MUNICIPALITY_ID_FORMAT = /^\d{5}$/;

export function get(municipalityId: string): Municipality | null {
  if (!municipalityId || !MUNICIPALITY_ID_FORMAT.exec(municipalityId)) return null;
  const municipality = localStorage.getItem(`${municipalityId}`);
  return municipality ? JSON.parse(municipality) : null;
}

export function save(municipality: Municipality): boolean {
  if (!municipality) throw Error("The given municipality is invalid");
  localStorage.setItem(municipality.id, JSON.stringify(municipality));
  return true;
}

export function remove(municipalityId: string): boolean {
  if (!get(municipalityId)) return false;
  localStorage.removeItem(`${municipalityId}`);
  return true;
}
