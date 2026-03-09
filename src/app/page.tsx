import AppRoot from "@components/AppRoot";
import { fetchMunicipalities } from "@infrastructure/FetchMunicipalities";

export default async function Home() {
  const allMunicipalities = await fetchMunicipalities();

  // Next.js RSC doesn't allow class instances to be passed as props, so we need to convert them to plain objects.
  return (
    <AppRoot
      allMunicipalities={allMunicipalities.map((municipality) => ({ ...municipality }))}
    />
  );
}
