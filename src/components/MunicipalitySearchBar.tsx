"use client";

import { Autocomplete, TextField } from "@mui/material";
import { Municipalities } from "@type/Municipalities";
import { Municipality } from "@type/Municipality";

type MunicipalitySearchBarProps = {
  onChange: (municipality: Municipality | null) => void;
  allMunicipalities: Municipality[];
  storedMunicipalities: Municipalities;
};

export function MunicipalitySearchBar({
  onChange,
  allMunicipalities,
  storedMunicipalities,
}: MunicipalitySearchBarProps) {
  return (
    <Autocomplete
      color={"primary.main"}
      disablePortal
      sx={{ width: 1 }}
      renderInput={(params) => <TextField {...params} label="Municipality" />}
      options={allMunicipalities || []}
      getOptionLabel={(option) => option.name}
      filterOptions={(options: Municipality[], { inputValue }) =>
        options.filter(
          (option) =>
            option.name.toLowerCase().startsWith(inputValue.toLowerCase()) &&
            !storedMunicipalities.getIds().includes(option.id)
        )
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, municipality: Municipality | null) => {
        onChange(municipality);
      }}
    />
  );
}
