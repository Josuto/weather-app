import React, {useState} from "react";
import "./App.css";
import {Autocomplete, TextField} from "@mui/material";
import {Municipality, useFetchMunicipalities} from "./hooks";

type MunicipalitySearchProps = {
  onChange: Function;
};

function MunicipalitySearch({onChange}: MunicipalitySearchProps) {
  return (
    <Autocomplete
      disablePortal
      sx={{width: 600}}
      renderInput={(params) => <TextField {...params} label="Municipality" />}
      options={useFetchMunicipalities()}
      getOptionLabel={(option) => `${option.name} - ${option.provinceName}`}
      filterOptions={(options, state) =>
        options.filter((option) =>
          option.name.toLowerCase().startsWith(state.inputValue.toLowerCase())
        )
      }
      isOptionEqualToValue={(option, value) =>
        option.municipalityId === value.municipalityId
      }
      onChange={(event, value: Municipality | null) => onChange(value)}
    />
  );
}

type CardProps = {
  municipalityName: string;
};

function Card({municipalityName}: CardProps) {
  return <h1>{municipalityName}</h1>;
}

const App = () => {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

  function addNewCard(municipality: Municipality) {
    if (municipality) {
      const updatedCards = Array.from(municipalities);
      updatedCards.push(municipality);
      setMunicipalities(updatedCards);
    }
  }

  return (
    <div className="App">
      <>
        <header className="App-header">
          <MunicipalitySearch onChange={addNewCard} />
        </header>
        <ul>
          {municipalities.map((municipality) => (
            <li key={municipality.municipalityId}>
              <Card municipalityName={municipality.municipalityId} />
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default App;
