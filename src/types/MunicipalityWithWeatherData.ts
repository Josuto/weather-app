import { Municipality, municipalityFixture } from "@type/Municipality";

export class Temperature {
  readonly actual!: string;
  readonly max!: string;
  readonly min!: string;

  constructor(temperature: Pick<Temperature, "actual" | "max" | "min">) {
    Object.assign(this, temperature);
  }

  toPlainObject() {
    return {
      actual: this.actual,
      max: this.max,
      min: this.min,
    };
  }
}

const temperatureFixture = ({ ...props }: Partial<Temperature> = {}): Temperature => {
  const defaults = new Temperature({
    actual: "5",
    max: "10",
    min: "2",
  });
  return new Temperature({ ...defaults, ...props });
};

export class WeatherData {
  readonly temperature!: Temperature;
  readonly humidity!: string;
  readonly wind!: string;
  readonly rainProbability!: string;

  constructor(weatherData: Pick<WeatherData, "temperature" | "humidity" | "wind" | "rainProbability">) {
    Object.assign(this, weatherData);
  }

  toPlainObject() {
    return {
      temperature: this.temperature.toPlainObject(),
      humidity: this.humidity,
      wind: this.wind,
      rainProbability: this.rainProbability,
    };
  }
}

const weatherDataFixture = ({ ...props }: Partial<WeatherData> = {}): WeatherData => {
  const defaults = new WeatherData({
    temperature: temperatureFixture(),
    humidity: "47",
    wind: "30",
    rainProbability: "5",
  });
  return new WeatherData({ ...defaults, ...props });
};

export class MunicipalityWithWeatherData extends Municipality {
  readonly province!: string;
  readonly weatherData?: WeatherData;

  constructor(municipalityWithWeatherData: Pick<MunicipalityWithWeatherData, "id" | "name" | "province" | "weatherData">) {
    super(municipalityWithWeatherData);
    Object.assign(this, municipalityWithWeatherData);
  }

  toPlainObject() {
    return {
      ...super.toPlainObject(),
      province: this.province,
      weatherData: this.weatherData?.toPlainObject(),
    };
  }
}

export const municipalityWithWeatherDataFixture = ({
  ...props
}: Partial<MunicipalityWithWeatherData> = {}): MunicipalityWithWeatherData => {
  const defaults = new MunicipalityWithWeatherData({
    ...municipalityFixture(),
    province: "Madrid",
    weatherData: weatherDataFixture(),
  });
  return new MunicipalityWithWeatherData({ ...defaults, ...props });
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
