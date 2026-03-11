import {
  getInitialLink,
  decode,
  ExternalMunicipalityWithWeatherData,
} from "../../helper";
import { NextRequest } from "next/server";

import { cacheLife } from "next/cache";
import { MunicipalityWithWeatherData } from "@type/MunicipalityWithWeatherData";

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
  const initialLink = await getInitialLink(AEMET_MUNICIPALITIES_URL + municipality);
  return await getMunicipalityWithWeatherData(initialLink);
}

async function getMunicipalityWithWeatherData(
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

function mapToMunicipalityWithWeatherData(
  extMunicipality: ExternalMunicipalityWithWeatherData
): MunicipalityWithWeatherData {
  const temperatura = extMunicipality.prediccion.dia[0].temperatura;
  const precipitacion = extMunicipality.prediccion.dia[0].precipitacion;
  const humedadRelativa = extMunicipality.prediccion.dia[0].humedadRelativa;
  const viento = extMunicipality.prediccion.dia[0].vientoAndRachaMax;

  return {
    id: extMunicipality.id.substring(2), // Remove 'id' prefix
    name: extMunicipality.nombre.trim(), // Fixes trailing spaces like "Abadiño "
    province: extMunicipality.provincia.trim(),
    weatherData: {
      temperature: {
        actual: getCurrentValue(temperatura),
        max: Math.max(...temperatura.map((t) => parseInt(t.value))).toString(),
        min: Math.min(...temperatura.map((t) => parseInt(t.value))).toString(),
      },
      humidity: getCurrentValue(humedadRelativa),
      rainProbability: getCurrentValue(precipitacion),
      wind: getCurrentValue(viento.filter((item) => item.value && item.periodo)),
    },
  };
}

function getCurrentValue(dataArray: { value: string; periodo: string }[]): string {
  const now = new Date().getHours();
  return (
    dataArray
      .find((d) => {
        const time = parseInt(d.periodo) == 24 ? 0 : parseInt(d.periodo);
        return now >= time && time + 1 > now;
      })
      ?.value.toString() || "N/A"
  );
}
