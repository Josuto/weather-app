import useSWR from "swr";
import { Municipality } from "../types/Municipality";
import {
  MunicipalityPayload,
  MunicipalityWithWeatherData,
} from "../types/MunicipalityWithWeatherData";

const MUNICIPALITY_WEATHER_DATA_URL =
  "https://www.el-tiempo.net/api/json/v2/provincias/{provinceId}/municipios/{id}";

const fetcher = (url: string) => fetch(url).then((result) => result.json());

export function useFetchMunicipalityWithWeatherData(
  municipality: Municipality
): MunicipalityPayload {
  if (!municipality) {
    throw new Error("The given municipality is invalid");
  }

  const municipalityWeatherDataFetchUrl = MUNICIPALITY_WEATHER_DATA_URL.replace(
    "{provinceId}",
    municipality.provinceId
  ).replace("{id}", municipality.id);

  const { data, error } = useSWR(municipalityWeatherDataFetchUrl, fetcher, {
    revalidateOnMount: true, // re-fetch data when page is refreshed
    refreshInterval: 30000, // re-fetch data every 30 minutes
  });

  if (data) {
    return {
      data: new MunicipalityWithWeatherData({
        weatherData: {
          temperature: {
            actual: data?.temperatura_actual,
            max: data?.temperaturas.max,
            min: data?.temperaturas.min,
          },
          humidity: data?.humedad,
          wind: data?.viento,
          rainProbability: data?.lluvia,
        },
        ...municipality,
      }),
      error: error,
    };
  }
  return {
    data: municipality,
    error: error,
  };
}
