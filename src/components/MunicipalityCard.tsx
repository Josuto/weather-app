import {Card, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import React, {useState} from "react";
import {Municipality} from "../types/Municipality";
import {Close, Favorite, FavoriteBorder} from "@mui/icons-material";
import {useFetchMunicipalityWithWeatherData} from "../hooks/UseFetchMunicipalityWithWeatherData";
import {MunicipalityWithWeatherDataOrError} from "../types/MunicipalityWithWeatherData";

type AMunicipality = {
  municipality: Municipality;
};

function MunicipalityCardStoreButton({municipality}: AMunicipality) {
  const [isSaved, setSaved] = useState(false);

  function handleMunicipalityStorage(isSaved: boolean, municipality: Municipality): void {
    if (!isSaved) {
      const municipalityIdentifiers = JSON.stringify(municipality.getIdentifiers());
      localStorage.setItem(municipality.id, municipalityIdentifiers);
    } else {
      localStorage.removeItem(municipality.id);
    }
  }

  return (
    <IconButton
      aria-label={isSaved ? "Discard" : "Save"}
      onClick={() => {
        handleMunicipalityStorage(isSaved, municipality);
        setSaved(!isSaved);
      }}
    >
      {!isSaved && <FavoriteBorder />}
      {isSaved && <Favorite />}
    </IconButton>
  );
}

function MunicipalityCardContent({data, error}: MunicipalityWithWeatherDataOrError) {
  if (error) {
    return <Typography>Loading error</Typography>;
  }
  if (!data) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <>
      <Typography variant={"h5"}>{data!.name}</Typography>
      <Typography variant={"subtitle1"}>{data!.provinceName}</Typography>
      <Typography variant={"subtitle1"}>{data!.temperature.actual}</Typography>
    </>
  );
}

type MunicipalityCardProps = {
  municipality: Municipality;
  onClose: Function;
};

export function MunicipalityCard({municipality, onClose}: MunicipalityCardProps) {
  const {data, error} = useFetchMunicipalityWithWeatherData(municipality);

  return (
    <Card>
      <CardHeader
        action={
          <>
            <MunicipalityCardStoreButton municipality={municipality} />
            <IconButton aria-label={"Close"} onClick={() => onClose(municipality)}>
              <Close />
            </IconButton>
          </>
        }
      />
      <CardContent sx={{textAlign: "center"}}>
        <MunicipalityCardContent data={data} error={error} />
      </CardContent>
    </Card>
  );
}
