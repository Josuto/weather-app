import {Card, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import React, {useState} from "react";
import {Municipality} from "../types/Municipality";
import {Close, Favorite, FavoriteBorder} from "@mui/icons-material";
import {useFetchMunicipalityWithWeatherData} from "../hooks/UseFetchMunicipalityWithWeatherData";

type AMunicipality = {
  municipality: Municipality;
};

function MunicipalityCardStoreButton({municipality}: AMunicipality) {
  const [isSaved, setSaved] = useState(false);

  return (
    <IconButton
      aria-label={isSaved ? "Discard" : "Save"}
      onClick={() => {
        if (!isSaved) {
          const municipalityIdentifiers = JSON.stringify(municipality.getIdentifiers());
          localStorage.setItem(municipality.id, municipalityIdentifiers);
        } else {
          localStorage.removeItem(municipality.id);
        }
        setSaved(!isSaved);
      }}
    >
      {!isSaved && <FavoriteBorder />}
      {isSaved && <Favorite />}
    </IconButton>
  );
}

type MunicipalityCardProps = {
  municipality: Municipality;
  onClose: Function;
};

export function MunicipalityCard({municipality, onClose}: MunicipalityCardProps) {
  const municipalityWeatherDataOrError =
    useFetchMunicipalityWithWeatherData(municipality);

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
        {municipalityWeatherDataOrError.error && <Typography>Loading error</Typography>}
        {!municipalityWeatherDataOrError.error &&
          !municipalityWeatherDataOrError.data && <Typography>Loading...</Typography>}
        {municipalityWeatherDataOrError.data && (
          <>
            <Typography variant={"h5"}>{municipality.name}</Typography>
            <Typography variant={"subtitle1"}>{municipality.provinceName}</Typography>
            <Typography variant={"subtitle1"}>
              {municipalityWeatherDataOrError.data?.temperature.actual}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
