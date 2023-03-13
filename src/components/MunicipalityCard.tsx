import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
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
import {
  MunicipalityWithWeatherData,
  MunicipalityWithWeatherDataOrError,
} from "../types/MunicipalityWithWeatherData";
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

function MunicipalityCardContentHeader(data: MunicipalityWithWeatherData) {
  return (
    <>
      <Typography variant={"h1"} color={"primary.contrastText"}>
        {data.name}
      </Typography>
      <Typography variant={"h2"} color={"primary.contrastText"}>
        {data.provinceName}
      </Typography>
    </>
  );
}

function MunicipalityCardContentLeftContent(data: MunicipalityWithWeatherData) {
  return (
    <>
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
            <Typography variant={"body1"}>{data.humidity}%</Typography>
          </Box>
        </Box>
        <Box>
          <Box>
            <Air />
          </Box>
          <Box>
            <Typography variant={"body1"}>{data.wind} km/h</Typography>
          </Box>
        </Box>
        <Box>
          <Box>
            <Umbrella />
          </Box>
          <Box>
            <Typography variant={"body1"}>{data.rainProbability || 0}%</Typography>
          </Box>
        </Box>
      </Stack>
    </>
  );
}

function MunicipalityCardContentRightContent(data: MunicipalityWithWeatherData) {
  return (
    <>
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
                <Typography variant={"body1"} sx={{color: "#ff9800"}}>
                  {data.temperature.max}&#176;
                </Typography>
              </Box>
              <Box>
                <Typography variant={"body1"} sx={{color: "#757ce8"}}>
                  {data.temperature.min}&#176;
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </>
  );
}

function MunicipalityCardContent({data, error}: MunicipalityWithWeatherDataOrError) {
  if (error || !data) {
    return (
      <>
        <Box pb={4} bgcolor={"primary.main"}>
          <Typography variant={"h1"} color={"primary.contrastText"}>
            No data
          </Typography>
        </Box>
        <Box pt={4} alignItems={"center"}>
          {error && <Typography variant={"h1"}>Loading error</Typography>}
          {!error && !data && <CircularProgress />}
        </Box>
      </>
    );
  }
  return (
    <>
      <Box pb={4} bgcolor={"primary.main"}>
        <MunicipalityCardContentHeader {...data} />
      </Box>
      <Stack pt={4} direction={{xs: "column", sm: "row"}} alignItems={"center"}>
        <MunicipalityCardContentLeftContent {...data} />
        <MunicipalityCardContentRightContent {...data} />
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
