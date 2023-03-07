import {Municipality} from "../types/Municipality";
import {get, MUNICIPALITY_ID_FORMAT} from "../util/BrowserStorage";

export function useBrowserStore(): Municipality[] {
  const savedMunicipalities = [];
  for (let i = 0, length = localStorage.length; i < length; i++) {
    const municipalityId = localStorage.key(i);
    if (municipalityId && MUNICIPALITY_ID_FORMAT.exec(municipalityId)) {
      savedMunicipalities.push(get(municipalityId)!);
    }
  }
  return savedMunicipalities;
}
