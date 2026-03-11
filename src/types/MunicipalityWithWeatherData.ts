import { Municipality, municipalityFixture } from "@type/Municipality";

type Temperature = {
  actual: string;
  max: string;
  min: string;
};

const temperatureFixture = ({ ...props }: Partial<Temperature> = {}): Temperature => {
  const defaults = {
    actual: "5",
    max: "10",
    min: "2",
  };
  return { ...defaults, ...props };
};

type WeatherData = {
  temperature: Temperature;
  humidity: string;
  wind: string;
  rainProbability: string;
};

const weatherDataFixture = ({ ...props }: Partial<WeatherData> = {}): WeatherData => {
  const defaults = {
    temperature: temperatureFixture(),
    humidity: "47",
    wind: "30",
    rainProbability: "5",
  };
  return { ...defaults, ...props };
};

export type MunicipalityWithWeatherData = Municipality & {
  province: string;
  weatherData: WeatherData;
};

export const municipalityWithWeatherDataFixture = ({
  ...props
}: Partial<MunicipalityWithWeatherData> = {}): MunicipalityWithWeatherData => {
  const defaults = {
    ...municipalityFixture(),
    province: "Madrid",
    weatherData: weatherDataFixture(),
  };
  return { ...defaults, ...props };
};

export type MunicipalityPayload = {
  municipalityWithWeatherData?: MunicipalityWithWeatherData;
  error?: Error;
  isLoading?: boolean;
};

export const municipalityPayloadFixture = ({
  ...props
}: Partial<MunicipalityPayload> = {}): MunicipalityPayload => {
  const defaults: MunicipalityPayload = {
    municipalityWithWeatherData: municipalityWithWeatherDataFixture(),
  };
  return { ...defaults, ...props };
};
