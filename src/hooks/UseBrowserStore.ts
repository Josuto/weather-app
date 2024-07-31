import { Municipalities } from "types/Municipalities";
import { Municipality } from "types/Municipality";
import { get, MUNICIPALITY_ID_FORMAT } from "../util/BrowserStorage";

export function useBrowserStore(): Municipalities {
  const municipalities: Municipality[] = [];
  for (let i = 0, length = localStorage.length; i < length; i++) {
    const municipalityId = localStorage.key(i);
    if (municipalityId && MUNICIPALITY_ID_FORMAT.exec(municipalityId)) {
      municipalities.push(get(municipalityId)!);
    }
  }
  return new Municipalities(municipalities);
}
