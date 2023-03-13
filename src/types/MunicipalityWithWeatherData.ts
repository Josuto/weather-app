import {Municipality, municipalityFixture} from "./Municipality";
import {RemoveMethods} from "../util/RemoveMethods";

class Temperature {
  readonly actual!: string;
  readonly max!: string;
  readonly min!: string;

  constructor(temperature: RemoveMethods<Temperature>) {
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

export class MunicipalityWithWeatherData extends Municipality {
  readonly temperature!: Temperature;
  readonly humidity!: string;
  readonly wind!: string;
  readonly rainProbability!: string;

  constructor(municipalityWithWeatherData: RemoveMethods<MunicipalityWithWeatherData>) {
    super(municipalityWithWeatherData);
    this.temperature = new Temperature(municipalityWithWeatherData.temperature);
    this.humidity = municipalityWithWeatherData.humidity;
    this.wind = municipalityWithWeatherData.wind;
    this.rainProbability = municipalityWithWeatherData.rainProbability;
  }
}

export const municipalityWithWeatherDataFixture = ({
  ...props
}: Partial<MunicipalityWithWeatherData> = {}): MunicipalityWithWeatherData => {
  const defaults = new MunicipalityWithWeatherData({
    ...municipalityFixture(),
    temperature: {...temperatureFixture()},
    humidity: "47",
    wind: "30",
    rainProbability: "5",
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
