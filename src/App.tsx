import React, {useState} from "react";
import {MunicipalitySearchBar} from "./components/MunicipalitySearchBar";
import {MunicipalityCard} from "./components/MunicipalityCard";
import {Municipality} from "./types/Municipality";
import {Container, Grid} from "@mui/material";
import {useBrowserStore} from "./hooks/UseBrowserStore";

function App() {
  const savedMunicipalities = useBrowserStore();
  const [municipalities, setMunicipalities] =
    useState<Municipality[]>(savedMunicipalities);

  function addMunicipality(municipality: Municipality) {
    if (municipality) {
      const updatedMunicipalities = Array.from(municipalities);
      updatedMunicipalities.push(municipality);
      setMunicipalities(updatedMunicipalities);
    }
  }

  function removeMunicipality(municipality: Municipality) {
    if (municipality) {
      const updatedMunicipalities = municipalities.filter(
        (currentMunicipality) => currentMunicipality.id !== municipality.id
      );
      setMunicipalities(updatedMunicipalities);
    }
  }

  return (
    <>
      <Container maxWidth={"sm"} sx={{pt: 5, pb: {xs: 5, sm: 10}}}>
        <MunicipalitySearchBar
          onChange={addMunicipality}
          municipalities={municipalities}
        />
      </Container>
      <Grid
        container
        direction={{xs: "column", sm: "row"}}
        spacing={2}
        sx={{px: {xs: 2.5, sm: 5}}}
      >
        {municipalities.map((municipality, index) => (
          <Grid key={index} item xs={4}>
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
