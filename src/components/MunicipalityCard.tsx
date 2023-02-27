import {Card, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import React from "react";
import {Municipality} from "../types/Municipality";
import {Close} from "@mui/icons-material";
import {useFetchMunicipalityWithWeatherData} from "../hooks/UseFetchMunicipalityWithWeatherData";

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
          <IconButton aria-label={"Close"} onClick={() => onClose(municipality)}>
            <Close />
          </IconButton>
        }
      />
      <CardContent sx={{textAlign: "center"}}>
        <Typography variant={"h5"}>{municipality.name}</Typography>
        <Typography variant={"subtitle1"}>{municipality.provinceName}</Typography>
        {municipalityWeatherDataOrError.error && <Typography>Loading error</Typography>}
        {!municipalityWeatherDataOrError.data && <Typography>Loading...</Typography>}
        <Typography variant={"subtitle1"}>
          {municipalityWeatherDataOrError.data.temperature.actual}
        </Typography>
      </CardContent>
    </Card>
  );
}
