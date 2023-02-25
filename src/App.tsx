import React, {useState} from "react";
import "./styles/App.css";
import Grid from "@mui/material/Grid";
import {MunicipalitySearch} from "./components/MunicipalitySearch";
import {MunicipalityCard} from "./components/MunicipalityCard";
import {Municipality} from "./types/Municipality";

function App() {
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
    <div className="App">
      <>
        <header className="App-header">
          <MunicipalitySearch onChange={addMunicipality} />
        </header>
        <Grid container spacing={2}>
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
    </div>
  );
}

export default App;
