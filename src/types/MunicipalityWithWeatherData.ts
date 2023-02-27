import {Municipality} from "./Municipality";

export type WeatherData = {
  temperature: {
    actual: string;
    max: string;
    min: string;
  };
};

export type MunicipalityWithWeatherData = Municipality & WeatherData;

export type MunicipalityWithWeatherDataOrError = {
  data: MunicipalityWithWeatherData | undefined;
  error: any;
};
