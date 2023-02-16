import {Card, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import React from "react";
import {Municipality} from "../types/Municipality";
import {Close} from "@mui/icons-material";

type MunicipalityCardProps = {
  municipality: Municipality;
  onClose: Function;
};

export function MunicipalityCard({municipality, onClose}: MunicipalityCardProps) {
  return (
    <Card>
      <CardHeader
        action={
          <IconButton aria-label={"Close"} onClick={() => onClose(municipality)}>
            <Close />
          </IconButton>
        }
      />
      <CardContent>
        <Typography variant={"h5"}>{municipality.name}</Typography>
        <Typography variant={"subtitle1"}>{municipality.provinceName}</Typography>
      </CardContent>
    </Card>
  );
}
