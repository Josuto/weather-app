import { useFetchMunicipalityWithWeatherData } from "@hooks/UseFetchMunicipalityWithWeatherData";
import {
  Air,
  Close,
  Favorite,
  FavoriteBorder,
  Opacity,
  Thermostat,
  Umbrella,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Municipality } from "@type/Municipality";
import {
  MunicipalityPayload,
  MunicipalityWithWeatherData,
} from "@type/MunicipalityWithWeatherData";
import { get, remove, save } from "@util/BrowserStorage";
import { useState } from "react";

type MunicipalityCardProps = {
  municipality: Municipality;
  onClose: (municipality: Municipality) => void;
};

function MunicipalityCardCloseButton({ municipality, onClose }: MunicipalityCardProps) {
  return (
    <IconButton
      aria-label={"Close"}
      onClick={() => {
        remove(municipality.id);
        onClose(municipality);
      }}
    >
      <Close color={"secondary"} />
    </IconButton>
  );
}

function MunicipalityCardFavoriteButton(municipality: Municipality) {
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
      aria-label={isSaved ? "Remove" : "Save"}
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

function MunicipalityCardContentLeftContent(municipality: MunicipalityWithWeatherData) {
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <Stack
      sx={smallScreen ? { width: "100%" } : { width: "50%" }}
      direction={"row"}
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
      justifyContent={"center"}
      pb={smallScreen ? 2 : 0}
    >
      <Box>
        <Opacity />
        <Typography variant={"body1"}>{municipality.weatherData?.humidity}%</Typography>
      </Box>
      <Box>
        <Air />
        <Typography variant={"body1"}>{municipality.weatherData?.wind} km/h</Typography>
      </Box>
      <Box>
        <Umbrella />
        <Typography variant={"body1"}>
          {municipality.weatherData?.rainProbability || 0}%
        </Typography>
      </Box>
    </Stack>
  );
}

function MunicipalityCardContentRightContent(municipality: MunicipalityWithWeatherData) {
  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <Stack
      sx={smallScreen ? { width: "100%" } : { width: "50%" }}
      direction={"row"}
      spacing={1}
      justifyContent={"center"}
    >
      <Box>
        <Thermostat />
      </Box>
      <Box>
        <Box>
          <Typography variant={"h3"}>
            {municipality.weatherData?.temperature.actual}&#176;
          </Typography>
        </Box>
        <Stack
          direction={"row"}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          justifyContent={"center"}
        >
          <Box>
            <Typography variant={"body1"} sx={{ color: "#ff9800" }}>
              {municipality.weatherData?.temperature.max}&#176;
            </Typography>
          </Box>
          <Box>
            <Typography variant={"body1"} sx={{ color: "#757ce8" }}>
              {municipality.weatherData?.temperature.min}&#176;
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

function MunicipalityCardContent({ data, error }: MunicipalityPayload) {
  const mediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  if (error || !(data instanceof MunicipalityWithWeatherData)) {
    return (
      <>
        <Box pt={2} alignItems={"center"}>
          {error && <Typography variant={"h1"}>Loading error</Typography>}
          {!error && <CircularProgress />}
        </Box>
      </>
    );
  }
  const municipalityWithWeatherData = data as MunicipalityWithWeatherData;
  return (
    <>
      <Stack pt={2} direction={mediumScreen ? "row" : "column"} alignItems={"center"}>
        <MunicipalityCardContentLeftContent {...municipalityWithWeatherData} />
        <MunicipalityCardContentRightContent {...municipalityWithWeatherData} />
      </Stack>
    </>
  );
}

export function MunicipalityCard({ municipality, onClose }: MunicipalityCardProps) {
  const { data, error } = useFetchMunicipalityWithWeatherData(municipality);

  return (
    <Card>
      <CardHeader
        sx={{ backgroundColor: "primary.main" }}
        action={
          <Stack direction={"column"}>
            <MunicipalityCardCloseButton municipality={municipality} onClose={onClose} />
            <MunicipalityCardFavoriteButton {...municipality} />
          </Stack>
        }
        title={
          <Typography variant={"h1"} align={"center"} color={"primary.contrastText"}>
            {data.name}
          </Typography>
        }
        subheader={
          <Typography variant={"h2"} align={"center"} color={"primary.contrastText"}>
            {data.provinceName}
          </Typography>
        }
      />
      <CardContent sx={{ textAlign: "center" }}>
        <MunicipalityCardContent data={data} error={error} />
      </CardContent>
    </Card>
  );
}
