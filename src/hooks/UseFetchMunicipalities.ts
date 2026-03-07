import { Municipality } from "@type/Municipality";
import useSWR from "swr";

const MUNICIPALITIES_URL = "/api/municipalities";
const fetcher = (url: string) => fetch(url).then((result) => result.json());

export function useFetchMunicipalities(): {
  municipalities: Municipality[];
  error: Error;
  isLoading: boolean;
} {
  const {
    data: municipalities,
    error,
    isLoading,
  } = useSWR<Municipality[]>(MUNICIPALITIES_URL, fetcher);
  return { municipalities: municipalities ?? [], error, isLoading };
}
