"use client";

import { MunicipalityCard } from "@components/MunicipalityCard";
import { MunicipalitySearchBar } from "@components/MunicipalitySearchBar";
import { Container, Grid } from "@mui/material";
import { Municipalities } from "@type/Municipalities";
import { Municipality } from "@type/Municipality";
import { fetchStoredMunicipalities } from "@util/BrowserStorage";
import { useEffect, useState } from "react";

function AppRoot({ allMunicipalities }: { allMunicipalities: Municipality[] }) {
  // The following block is needed to avoid server-vs-client initial render mismatch;
  // the server doesn't have access to the browser storage, so it will always return
  // an empty array, while the client will return the actual saved municipalities
  const [storedMunicipalities, setStoredMunicipalities] = useState<Municipalities>(
    new Municipalities([])
  );
  useEffect(() => {
    const storedMunicipalities = fetchStoredMunicipalities();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoredMunicipalities(storedMunicipalities);
  }, []);

  function addMunicipalityToStorage(municipality: Municipality | null) {
    setStoredMunicipalities(storedMunicipalities.add(municipality));
  }

  function removeMunicipalityFromStorage(municipality: Municipality) {
    setStoredMunicipalities(storedMunicipalities.removeById(municipality.id));
  }

  return (
    <>
      <Container maxWidth={"sm"} sx={{ pt: 5, pb: { xs: 5, sm: 10 } }}>
        <MunicipalitySearchBar
          onChange={addMunicipalityToStorage}
          allMunicipalities={allMunicipalities}
          storedMunicipalities={storedMunicipalities}
        />
      </Container>
      <Grid
        container
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ px: { xs: 2.5, sm: 5 } }}
      >
        {storedMunicipalities.map((municipality) => (
          <MunicipalityCard
            key={municipality.id}
            municipality={municipality}
            onClose={removeMunicipalityFromStorage}
          />
        ))}
      </Grid>
    </>
  );
}

export default AppRoot;
