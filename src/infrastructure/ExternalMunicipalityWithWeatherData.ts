import { ExternalMunicipality } from "@infrastructure/ExternalMunicipality";
import { MunicipalityWithWeatherData } from "@type/MunicipalityWithWeatherData";

export type ExternalMunicipalityWithWeatherData = ExternalMunicipality & {
  provincia: string;
  prediccion: {
    dia: [
      {
        temperatura: [
          {
            value: string;
            periodo: string;
          },
        ];
        precipitacion: [
          {
            value: string;
            periodo: string;
          },
        ];
        vientoAndRachaMax: [
          {
            value: string;
            periodo: string;
          },
        ];
        humedadRelativa: [
          {
            value: string;
            periodo: string;
          },
        ];
      },
    ];
  };
};

export function mapToMunicipalityWithWeatherData(
  extMunicipality: ExternalMunicipalityWithWeatherData
): MunicipalityWithWeatherData {
  const temperatura = extMunicipality.prediccion.dia[0].temperatura;
  const precipitacion = extMunicipality.prediccion.dia[0].precipitacion;
  const humedadRelativa = extMunicipality.prediccion.dia[0].humedadRelativa;
  const viento = extMunicipality.prediccion.dia[0].vientoAndRachaMax;

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
