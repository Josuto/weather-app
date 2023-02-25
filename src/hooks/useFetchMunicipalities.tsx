import useSWR from "swr";
import {Municipality} from "../types/Municipality";

type ExternalMunicipality = {
  NOMBRE: string;
  NOMBRE_PROVINCIA: string;
  CODPROV: string;
  CODIGOINE: string;
};

const MUNICIPALITIES_URL = "https://www.el-tiempo.net/api/json/v2/municipios";

const fetcher = (url: string) => fetch(url).then((result) => result.json());

export function useFetchMunicipalities(): Municipality[] {
  const municipalities: ExternalMunicipality[] = useSWR(MUNICIPALITIES_URL, fetcher, {
    suspense: true,
  }).data;

  return municipalities
    .map((municipality) => {
      return {
        id: municipality["CODIGOINE"].slice(0, 5),
        name: municipality["NOMBRE"],
        provinceId: municipality["CODPROV"],
        provinceName: municipality["NOMBRE_PROVINCIA"],
      };
    })
    .sort((municipality1, municipality2) => {
      if (municipality1.name < municipality2.name) {
        return -1;
      }
      if (municipality2.name < municipality1.name) {
        return 1;
      }
      return 0;
    });
}
