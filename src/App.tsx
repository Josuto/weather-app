import React, {useState} from "react";
import "./styles/App.css";
import {MunicipalitySearch} from "./components/MunicipalitySearch";
import {MunicipalityCard} from "./components/MunicipalityCard";
import {Municipality} from "./types/Municipality";
import {Container, Grid} from "@mui/material";

function App() {
  // const savedMunicipalities = useBrowserStore();
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

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
      <Container maxWidth={"sm"} sx={{pt: 5, pb: 10}}>
        <MunicipalitySearch onChange={addMunicipality} />
      </Container>
      <Grid container spacing={2} sx={{px: 5}}>
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
