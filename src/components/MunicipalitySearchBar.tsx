import { useFetchMunicipalities } from "@hooks/UseFetchMunicipalities";
import { Autocomplete, TextField } from "@mui/material";
import { Municipalities } from "@type/Municipalities";
import { Municipality } from "@type/Municipality";

type MunicipalitySearchBarProps = {
  onChange: (municipality: Municipality | null) => void;
  municipalities: Municipalities;
};

export function MunicipalitySearchBar({
  onChange,
  municipalities,
}: MunicipalitySearchBarProps) {
  return (
    <Autocomplete
      color={"primary.main"}
      disablePortal
      sx={{ width: 1 }}
      renderInput={(params) => <TextField {...params} label="Municipality" />}
      options={useFetchMunicipalities()}
      getOptionLabel={(option) => `${option.name} (${option.provinceName})`}
      filterOptions={(options: Municipality[], { inputValue }) =>
        options.filter(
          (option) =>
            option.name.toLowerCase().startsWith(inputValue.toLowerCase()) &&
            !municipalities.getIds().includes(option.id)
        )
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, municipality: Municipality | null) => {
        onChange(municipality);
      }}
    />
  );
}
