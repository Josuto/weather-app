import { fetchInitialLink, decode } from "../../helper";
import { NextRequest } from "next/server";

import { cacheLife } from "next/cache";
import { MunicipalityWithWeatherData } from "@type/MunicipalityWithWeatherData";
import { mapToMunicipalityWithWeatherData } from "@infrastructure/ExternalMunicipalityWithWeatherData";

const AEMET_MUNICIPALITIES_URL =
  "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/weather-data/[municipality]">
): Promise<Response> {
  try {
    const { municipality } = await context.params;
    const municipalityWithWeatherData =
      await fetchMunicipalityWithWeatherData(municipality);
    return Response.json(municipalityWithWeatherData);
  } catch (error) {
    return new Response(`Failed to fetch municipalities: ${error}`, { status: 500 });
  }
}

async function fetchMunicipalityWithWeatherData(
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

  if (!response.ok)
    throw new Error(
      `Failed to fetch municipality with weather data: ${response.statusText}`
    );

  const decodedData = await decode(response);
  return mapToMunicipalityWithWeatherData(decodedData[0]);
}
