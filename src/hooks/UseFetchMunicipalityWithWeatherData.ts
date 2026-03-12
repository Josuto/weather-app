import {
  MunicipalityPayload,
  MunicipalityWithWeatherData,
} from "@type/MunicipalityWithWeatherData";
import useSWR from "swr";

const MUNICIPALITY_WEATHER_DATA_URL = "/api/municipalities/{municipalityId}/weather-data";
const fetcher = (url: string) => fetch(url).then((result) => result.json());

export function useFetchMunicipalityWithWeatherData(
  municipalityId: string
): MunicipalityPayload {
  if (!municipalityId) {
    throw new Error("The given municipality is invalid");
  }

  const municipalityWeatherDataFetchUrl = MUNICIPALITY_WEATHER_DATA_URL.replace(
    "{municipalityId}",
    municipalityId
  );
  const {
    data: municipalityWithWeatherData,
    error,
    isLoading,
  } = useSWR<MunicipalityWithWeatherData>(municipalityWeatherDataFetchUrl, fetcher, {
    revalidateOnMount: true, // re-fetch data when page is refreshed
    refreshInterval: 30000, // re-fetch data every 30 minutes
  });
  return { municipalityWithWeatherData, error, isLoading };
}
