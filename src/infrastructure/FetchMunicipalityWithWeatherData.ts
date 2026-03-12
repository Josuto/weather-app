import { cacheLife } from "next/cache";
import { MunicipalityWithWeatherData } from "@type/MunicipalityWithWeatherData";
import { mapToMunicipalityWithWeatherData } from "@infrastructure/ExternalMunicipalityWithWeatherData";
import { fetchInitialLink } from "@infrastructure/FetchInitialLink";
import { decode } from "@util/DecodeResult";

const AEMET_MUNICIPALITIES_URL =
  "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/";

export async function fetchMunicipalityWithWeatherData(
  municipality: string
): Promise<MunicipalityWithWeatherData> {
  "use cache";

  cacheLife("hours");
  const initialLink = await fetchInitialLink(AEMET_MUNICIPALITIES_URL + municipality);
  return await fetchMunicipalityWithWeatherDataFrom(initialLink);
}

async function fetchMunicipalityWithWeatherDataFrom(
  url: string
): Promise<MunicipalityWithWeatherData> {
  let response;
  try {
    response = await fetch(url, {
      cache: "no-store",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Failed to fetch municipality with weather data: ${errorMessage}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch municipality with weather data: ${response.statusText}`
    );
  }

  const decodedData = await decode(response);
  return mapToMunicipalityWithWeatherData(decodedData[0]);
}
