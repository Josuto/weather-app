import { Municipality } from "@type/Municipality";
import { cacheLife } from "next/cache";
import { mapToMunicipalities } from "@infrastructure/ExternalMunicipality";
import { fetchInitialLink } from "@infrastructure/FetchInitialLink";
import { decode } from "@util/DecodeResult";

const AEMET_MUNICIPALITIES_URL =
  "https://opendata.aemet.es/opendata/api/maestro/municipios";

export async function fetchMunicipalities(): Promise<Municipality[]> {
  "use cache";

  try {
    cacheLife("max");
    const initialLink = await fetchInitialLink(AEMET_MUNICIPALITIES_URL);
    return await fetchMunicipalitiesFrom(initialLink);
  } catch (error) {
    throw new Error(`Failed to fetch municipalities: ${error}`);
  }
}

async function fetchMunicipalitiesFrom(url: string): Promise<Municipality[]> {
  let response;
  try {
    response = await fetch(url, {
      cache: "no-store",
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
