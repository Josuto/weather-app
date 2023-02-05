import React from "react";
import "./App.css";
import {Autocomplete, TextField} from "@mui/material";
import useSWR from "swr";

type ExternalMunicipality = {NOMBRE_CAPITAL: string};

const fetcher = (url: string) => fetch(url).then((result) => result.json());

function useFetchMunicipalities() {
  const {data} = useSWR(
    "https://www.el-tiempo.net/api/json/v2/provincias/08/municipios",
    fetcher,
    {suspense: true}
  );

  const externalMunicipalities = Object.entries(data.municipios) as unknown as [
    key: string,
    value: ExternalMunicipality
  ][];

  return externalMunicipalities.map((externalMunicipality) => {
    return {
      label: externalMunicipality[1]["NOMBRE_CAPITAL"],
      locationId: externalMunicipality[0],
    };
  });
}

function LocationSearcher() {
  return (
    <Autocomplete
      disablePortal
      sx={{width: 300}}
      renderInput={(params) => <TextField {...params} label="Location" />}
      options={useFetchMunicipalities()}
    />
  );
}

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <LocationSearcher />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
