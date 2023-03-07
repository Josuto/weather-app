import {Municipality} from "../types/Municipality";

export function useBrowserStore(): Municipality[] {
  const savedMunicipalities = [];
  for (let i = 0, length = localStorage.length; i < length; i++) {
    const savedMunicipality = new Municipality(
      JSON.parse(localStorage.getItem(localStorage.key(i)!)!)
    );
    savedMunicipalities.push(savedMunicipality);
  }
  return savedMunicipalities;
}
