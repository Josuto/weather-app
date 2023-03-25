import {Municipality, municipalityFixture} from "./Municipality";

class Temperature {
  readonly actual!: string;
  readonly max!: string;
  readonly min!: string;

  constructor(temperature: Temperature) {
    Object.assign(this, temperature);
  }
}

const temperatureFixture = ({...props}: Partial<Temperature> = {}): Temperature => {
  const defaults = new Temperature({
    actual: "5",
    max: "10",
    min: "2",
  });
  return new Temperature({...defaults, ...props});
};

class WeatherData {
  readonly temperature!: Temperature;
  readonly humidity!: string;
  readonly wind!: string;
  readonly rainProbability!: string;

  constructor(weatherData: WeatherData) {
    Object.assign(this, weatherData);
  }
}

const weatherDataFixture = ({...props}: Partial<WeatherData> = {}): WeatherData => {
  const defaults = new WeatherData({
    temperature: {...temperatureFixture()},
    humidity: "47",
    wind: "30",
    rainProbability: "5",
  });
  return new WeatherData({...defaults, ...props});
};

export class MunicipalityWithWeatherData extends Municipality {
  readonly weatherData?: WeatherData;

  constructor(municipalityWithWeatherData: MunicipalityWithWeatherData) {
    super(municipalityWithWeatherData);
    Object.assign(this, municipalityWithWeatherData);
  }
}

export const municipalityWithWeatherDataFixture = ({
  ...props
}: Partial<MunicipalityWithWeatherData> = {}): MunicipalityWithWeatherData => {
  const defaults = new MunicipalityWithWeatherData({
    ...municipalityFixture(),
    weatherData: weatherDataFixture(),
  });
  return new MunicipalityWithWeatherData({...defaults, ...props});
};

export type MunicipalityPayload = {
  data: Municipality;
  error?: any;
};

export const municipalityPayloadFixture = ({
  ...props
}: Partial<MunicipalityPayload> = {}): MunicipalityPayload => {
  const defaults: MunicipalityPayload = {
    data: municipalityWithWeatherDataFixture(),
  };
  return {...defaults, ...props};
};
