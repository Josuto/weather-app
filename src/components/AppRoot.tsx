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
  const [municipalities, setMunicipalities] = useState<Municipalities>(
    new Municipalities([])
  );
  useEffect(() => {
    const municipalities = fetchStoredMunicipalities();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMunicipalities(municipalities);
  }, []);

  function addMunicipality(municipality: Municipality | null) {
    setMunicipalities(municipalities.add(municipality));
  }

  function removeMunicipality(municipality: Municipality) {
    setMunicipalities(municipalities.removeById(municipality.id));
  }

  return (
    <>
      <Container maxWidth={"sm"} sx={{ pt: 5, pb: { xs: 5, sm: 10 } }}>
        <MunicipalitySearchBar
          onChange={addMunicipality}
          allMunicipalities={allMunicipalities}
          storedMunicipalities={municipalities}
        />
      </Container>
      <Grid
        container
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ px: { xs: 2.5, sm: 5 } }}
      >
        {municipalities.map((municipality) => (
          <MunicipalityCard
            key={municipality.id}
            municipality={municipality}
            onClose={removeMunicipality}
          />
        ))}
      </Grid>
    </>
  );
}

export default AppRoot;
