import {Municipality} from "../types/Municipality";

export function useBrowserStore(municipalities: Municipality[]) {
  const selectedMunicipalities = [];
  for (let i = 0, length = localStorage.length; i <= length; i++) {
    const selectedMunicipality = municipalities.find(
      (municipality) => municipality.id === localStorage.key(i)
    );
    selectedMunicipalities.push(selectedMunicipality);
  }
}
