import useSWR from "swr";
import { Municipality } from "../types/Municipality";

export type ExternalMunicipality = {
  NOMBRE: string;
  NOMBRE_PROVINCIA: string;
  CODPROV: string;
  CODIGOINE: string;
};

const MUNICIPALITIES_URL =
  "https://www.el-tiempo.net/api/json/v2/provincias/01/municipios";

const fetcher = (url: string) => fetch(url).then((result) => result.json());

export function useFetchMunicipalities(): Municipality[] {
  const { data, error } = useSWR(MUNICIPALITIES_URL, fetcher, {
    suspense: true,
  });

  if (error) {
    return [];
  }

  const municipalities: ExternalMunicipality[] = data.municipios;
  return municipalities
    .map(
      (municipality) =>
        new Municipality({
          id: municipality["CODIGOINE"].slice(0, 5),
          name: municipality["NOMBRE"],
          provinceId: municipality["CODPROV"],
          provinceName: municipality["NOMBRE_PROVINCIA"],
        })
    )
    .sort((municipality1, municipality2) =>
      municipality1.name.localeCompare(municipality2.name)
    );
}
