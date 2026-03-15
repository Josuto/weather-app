import { ExternalMunicipality } from "@infrastructure/ExternalMunicipality";
import { MunicipalityWithWeatherData } from "@type/MunicipalityWithWeatherData";

type ValueWithPeriod = {
  value: string;
  periodo: string;
};

export type ExternalMunicipalityWithWeatherData = ExternalMunicipality & {
  provincia: string;
  prediccion: {
    dia: {
      temperatura: ValueWithPeriod[];
      precipitacion: ValueWithPeriod[];
      vientoAndRachaMax: ValueWithPeriod[];
      humedadRelativa: ValueWithPeriod[];
    }[];
  };
};

export const createMockExternalMunicipality = (
  props: Partial<ExternalMunicipalityWithWeatherData> = {}
): ExternalMunicipalityWithWeatherData => {
  return {
    id: "id28001",
    nombre: "Madrid ",
    provincia: "Madrid ",
    prediccion: {
      dia: [
        {
          temperatura: [{ value: "10", periodo: "00" }],
          precipitacion: [{ value: "10", periodo: "00" }],
          vientoAndRachaMax: [{ value: "15", periodo: "00" }],
          humedadRelativa: [{ value: "60", periodo: "00" }],
        },
        {
          temperatura: [
            { value: "5", periodo: "00" },
            { value: "8", periodo: "01" },
            { value: "12", periodo: "02" },
          ],
          precipitacion: [
            { value: "10", periodo: "00" },
            { value: "5", periodo: "01" },
            { value: "0", periodo: "02" },
          ],
          vientoAndRachaMax: [
            { value: "15", periodo: "00" },
            { value: "20", periodo: "01" },
            { value: "18", periodo: "02" },
          ],
          humedadRelativa: [
            { value: "60", periodo: "00" },
            { value: "55", periodo: "01" },
            { value: "50", periodo: "02" },
          ],
        },
      ],
    },
    ...props,
  };
};

export function mapToMunicipalityWithWeatherData(
  extMunicipality: ExternalMunicipalityWithWeatherData
): MunicipalityWithWeatherData {
  const temperatura = extMunicipality.prediccion.dia[1].temperatura;
  const precipitacion = extMunicipality.prediccion.dia[1].precipitacion;
  const humedadRelativa = extMunicipality.prediccion.dia[1].humedadRelativa;
  const viento = extMunicipality.prediccion.dia[1].vientoAndRachaMax;

  return {
    id: extMunicipality.id.substring(2), // Remove 'id' prefix
    name: extMunicipality.nombre.trim(), // Fixes trailing spaces like "Abadiño "
    province: extMunicipality.provincia.trim(),
    weatherData: {
      temperature: {
        actual: getCurrentValue(temperatura),
        max: Math.max(...temperatura.map((t) => parseInt(t.value))).toString(),
        min: Math.min(...temperatura.map((t) => parseInt(t.value))).toString(),
      },
      humidity: getCurrentValue(humedadRelativa),
      rainProbability: getCurrentValue(precipitacion),
      wind: getCurrentValue(viento.filter((item) => item.value && item.periodo)),
    },
  };
}

function getCurrentValue(dataArray: { value: string; periodo: string }[]): string {
  const now = new Date().getHours();
  return (
    dataArray
      .find((d) => {
        const time = parseInt(d.periodo) == 24 ? 0 : parseInt(d.periodo);
        return now >= time && time + 1 > now;
      })
      ?.value.toString() || "N/A"
  );
}
