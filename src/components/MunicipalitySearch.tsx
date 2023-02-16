import {Autocomplete, TextField} from "@mui/material";
import {useFetchMunicipalities} from "../hooks/useFetchMunicipalities";
import React from "react";
import {Municipality} from "../types/Municipality";

type MunicipalitySearchProps = {
  onChange: Function;
};

export function MunicipalitySearch({onChange}: MunicipalitySearchProps) {
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
