import {Autocomplete, TextField} from "@mui/material";
import {useFetchMunicipalities} from "../hooks/UseFetchMunicipalities";
import React from "react";
import {Municipality} from "../types/Municipality";

type MunicipalitySearchBarProps = {
  onChange: Function;
  municipalities: Municipality[];
};

export function MunicipalitySearchBar({
  onChange,
  municipalities,
}: MunicipalitySearchBarProps) {
  const municipalityIds = municipalities.reduce(
    (municipalityIds: string[], municipality) => {
      if (municipality) municipalityIds.push(municipality.id);
      return municipalityIds;
    },
    []
  );

  return (
    <Autocomplete
      color={"primary.main"}
      disablePortal
      sx={{width: 1}}
      renderInput={(params) => <TextField {...params} label="Municipality" />}
      options={useFetchMunicipalities()}
      getOptionLabel={(option) => `${option.name} (${option.provinceName})`}
      filterOptions={(options: Municipality[], {inputValue}) =>
        options.filter((option) => {
          return (
            option.name.toLowerCase().startsWith(inputValue.toLowerCase()) &&
            !municipalityIds.includes(option.id)
          );
        })
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, value: Municipality | null) => {
        onChange(value);
      }}
    />
  );
}
