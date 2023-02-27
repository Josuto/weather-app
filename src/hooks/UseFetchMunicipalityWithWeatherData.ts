import {Municipality} from "../types/Municipality";
import useSWR from "swr";
import {MunicipalityWithWeatherDataOrError} from "../types/MunicipalityWithWeatherData";

const MUNICIPALITY_WEATHER_DATA_URL =
  "https://www.el-tiempo.net/api/json/v2/provincias/{provinceId}/municipios/{id}";

const fetcher = (url: string) => fetch(url).then((result) => result.json());

export function useFetchMunicipalityWithWeatherData(
  municipality: Municipality
): MunicipalityWithWeatherDataOrError {
  const municipalityWeatherDataFetchUrl = MUNICIPALITY_WEATHER_DATA_URL.replace(
    "{provinceId}",
    municipality.provinceId
  ).replace("{id}", municipality.id);

  const {data, error} = useSWR(municipalityWeatherDataFetchUrl, fetcher);

  if (data) {
    return {
      data: {
        temperature: {
          actual: data?.temperatura_actual,
          max: data?.temperaturas.max,
          min: data?.temperaturas.min,
        },
        ...municipality,
      },
      error: error,
    };
  }
  return {
    data: undefined,
    error: error,
  };
}
