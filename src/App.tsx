import { MunicipalityCard } from "@components/MunicipalityCard";
import { MunicipalitySearchBar } from "@components/MunicipalitySearchBar";
import { useBrowserStore } from "@hooks/UseBrowserStore";
import { Container, Grid, Theme, useMediaQuery } from "@mui/material";
import { Municipalities } from "@type/Municipalities";
import { Municipality } from "@type/Municipality";
import { useState } from "react";

function App() {
  const savedMunicipalities = useBrowserStore();
  const [municipalities, setMunicipalities] =
    useState<Municipalities>(savedMunicipalities);
  const largeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const mediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

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
          municipalities={municipalities}
        />
      </Container>
      <Grid
        container
        direction={largeScreen || mediumScreen ? "row" : "column"}
        spacing={2}
        sx={{ px: { xs: 2.5, sm: 5 } }}
      >
        {municipalities.map((municipality, index) => (
          <Grid key={index} item xs={largeScreen ? 4 : 6}>
            <MunicipalityCard
              key={municipality.id}
              municipality={municipality}
              onClose={removeMunicipality}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default App;
