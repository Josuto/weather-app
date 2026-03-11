import AppRoot from "@components/AppRoot";
import { fetchMunicipalities } from "@infrastructure/FetchMunicipalities";

export default async function Home() {
  const allMunicipalities = await fetchMunicipalities();

  return <AppRoot allMunicipalities={allMunicipalities} />;
}
