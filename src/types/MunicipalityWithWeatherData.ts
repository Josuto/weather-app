import {Municipality, municipalityFixture, MunicipalityType} from "./Municipality";

type TemperatureType = {
  actual: string;
  max: string;
  min: string;
};

class Temperature {
  readonly actual: string;
  readonly max: string;
  readonly min: string;

  constructor(temperature: TemperatureType) {
    this.actual = temperature.actual;
    this.max = temperature.max;
    this.min = temperature.min;
  }
}

const temperatureFixture = ({...props}: Partial<TemperatureType> = {}): Temperature => {
  const defaults = new Temperature({
    actual: "5",
    max: "10",
    min: "2",
  });
  return {...defaults, ...props};
};

export type WeatherDataType = {
  temperature: TemperatureType;
};

export type MunicipalityWithWeatherDataType = MunicipalityType & WeatherDataType;

export class MunicipalityWithWeatherData extends Municipality {
  readonly temperature: Temperature;

  constructor(municipalityWithWeatherData: MunicipalityWithWeatherDataType) {
    super(municipalityWithWeatherData);
    this.temperature = new Temperature(municipalityWithWeatherData.temperature);
  }
}

export const municipalityWithWeatherDataFixture = ({
  ...props
}: Partial<MunicipalityWithWeatherDataType> = {}): MunicipalityWithWeatherData => {
  const defaults = new MunicipalityWithWeatherData({
    ...municipalityFixture(),
    temperature: {...temperatureFixture()},
  });
  return new MunicipalityWithWeatherData({...defaults, ...props});
};

export type MunicipalityWithWeatherDataOrError = {
  data: MunicipalityWithWeatherData | undefined;
  error: any;
};

export const municipalityWithWeatherDataOrErrorFixture = ({
  ...props
}: Partial<MunicipalityWithWeatherDataOrError> = {}): MunicipalityWithWeatherDataOrError => {
  const defaults: MunicipalityWithWeatherDataOrError = {
    data: municipalityWithWeatherDataFixture(),
    error: undefined,
  };
  return {...defaults, ...props};
};
