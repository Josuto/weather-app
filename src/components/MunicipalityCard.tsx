import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, {useState} from "react";
import {Municipality} from "../types/Municipality";
import {
  Air,
  Close,
  Favorite,
  FavoriteBorder,
  Opacity,
  Thermostat,
  Umbrella,
} from "@mui/icons-material";
import {useFetchMunicipalityWithWeatherData} from "../hooks/UseFetchMunicipalityWithWeatherData";
import {MunicipalityWithWeatherDataOrError} from "../types/MunicipalityWithWeatherData";
import {get, remove, save} from "../util/BrowserStorage";

type AMunicipality = {
  municipality: Municipality;
};

function MunicipalityCardStoreButton({municipality}: AMunicipality) {
  const [isSaved, setSaved] = useState(!!get(municipality.id));

  function handleMunicipalityStorage(isSaved: boolean, municipality: Municipality): void {
    if (!isSaved) {
      save(municipality);
    } else {
      remove(municipality.id);
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
      {!isSaved && <FavoriteBorder color={"secondary"} />}
      {isSaved && <Favorite color={"secondary"} />}
    </IconButton>
  );
}

function MunicipalityCardContent({data, error}: MunicipalityWithWeatherDataOrError) {
  if (error) {
    return <Typography variant={"h1"}>Loading error</Typography>;
  }
  if (!data) {
    return <Typography variant={"h1"}>Loading...</Typography>;
  }
  return (
    <>
      <Box pb={2} bgcolor={"primary.main"}>
        <Typography variant={"h1"} color={"primary.contrastText"}>
          {data.name}
        </Typography>
        <Typography variant={"h2"} color={"primary.contrastText"}>
          {data.provinceName}
        </Typography>
      </Box>
      <Stack pt={4} direction={{xs: "column", sm: "row"}} alignItems={"center"}>
        <Stack
          sx={{width: {sm: "50%"}}}
          direction={"row"}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          justifyContent={"center"}
          pb={{xs: 2, sm: 0}}
        >
          <Box>
            <Box>
              <Opacity />
            </Box>
            <Box>
              <Typography variant={"body2"}>{data.humidity}%</Typography>
            </Box>
          </Box>
          <Box>
            <Box>
              <Air />
            </Box>
            <Box>
              <Typography variant={"body2"}>{data.wind} km/h</Typography>
            </Box>
          </Box>
          <Box>
            <Box>
              <Umbrella />
            </Box>
            <Box>
              <Typography variant={"body2"}>{data.rainProbability || 0}%</Typography>
            </Box>
          </Box>
        </Stack>
        <Box sx={{width: {sm: "50%"}}}>
          <Stack direction={"row"} spacing={1} justifyContent={"center"}>
            <Box>
              <Thermostat />
            </Box>
            <Box>
              <Box>
                <Typography variant={"h3"}>{data.temperature.actual}&#176;</Typography>
              </Box>
              <Stack
                direction={"row"}
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                justifyContent={"center"}
              >
                <Box>
                  <Typography variant={"body2"}>{data.temperature.max}&#176;</Typography>
                </Box>
                <Box>
                  <Typography variant={"body2"}>{data.temperature.min}&#176;</Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
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
        sx={{pb: 0, backgroundColor: "primary.main"}}
        action={
          <>
            <MunicipalityCardStoreButton municipality={municipality} />
            <IconButton aria-label={"Close"} onClick={() => onClose(municipality)}>
              <Close color={"secondary"} />
            </IconButton>
          </>
        }
      />
      <CardContent sx={{textAlign: "center", p: 0}}>
        <MunicipalityCardContent data={data} error={error} />
      </CardContent>
    </Card>
  );
}
