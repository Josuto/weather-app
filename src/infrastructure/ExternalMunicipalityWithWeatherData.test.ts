import {
  mapToMunicipalityWithWeatherData,
  ExternalMunicipalityWithWeatherData,
  createMockExternalMunicipality,
} from "@infrastructure/ExternalMunicipalityWithWeatherData";
import { municipalityWithWeatherDataFixture } from "@type/MunicipalityWithWeatherData";

describe("Given the mapToMunicipalityWithWeatherData function", () => {
  describe("Happy path - data transformation", () => {
    it("should remove 'id' prefix from municipality ID", () => {
      const external = createMockExternalMunicipality();

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.id).toBe("28001");
    });

    it("should trim trailing spaces from municipality name", () => {
      const external = createMockExternalMunicipality({ nombre: "  Toledo  " });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.name).toBe("Toledo");
    });

    it("should trim trailing spaces from province name", () => {
      const external = createMockExternalMunicipality({
        provincia: "  Castilla-La Mancha  ",
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.province).toBe("Castilla-La Mancha");
    });

    it("should return all expected weather data fields", () => {
      const external = createMockExternalMunicipality();

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData).toHaveProperty("temperature");
      expect(result.weatherData).toHaveProperty("humidity");
      expect(result.weatherData).toHaveProperty("rainProbability");
      expect(result.weatherData).toHaveProperty("wind");
    });

    it("should return max an min temperature values", () => {
      const external = createMockExternalMunicipality({
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
                { value: "15", periodo: "02" },
                { value: "12", periodo: "03" },
              ],
              precipitacion: [{ value: "0", periodo: "00" }],
              vientoAndRachaMax: [{ value: "0", periodo: "00" }],
              humedadRelativa: [{ value: "0", periodo: "00" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.temperature.max).toBe("15");
      expect(result.weatherData.temperature.min).toBe("5");
      // Current temperature value depends on current hour, so we won't assert it here
    });

    it("should return current temperature for hour 0 (midnight) when now is 0", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 0, 30, 0)); // 00:30

      const external = createMockExternalMunicipality({
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
                { value: "4", periodo: "00" },
                { value: "5", periodo: "01" },
                { value: "6", periodo: "02" },
                { value: "7", periodo: "03" },
                { value: "8", periodo: "04" },
              ],
              precipitacion: [{ value: "10", periodo: "0" }],
              vientoAndRachaMax: [{ value: "15", periodo: "0" }],
              humedadRelativa: [{ value: "60", periodo: "0" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.temperature.actual).toBe("4");
      jest.useRealTimers();
    });

    it("should return current temperature for hour 5 when now is 5", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 5, 15, 0)); // 05:15

      const external = createMockExternalMunicipality({
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
                { value: "2", periodo: "00" },
                { value: "3", periodo: "01" },
                { value: "4", periodo: "02" },
                { value: "5", periodo: "03" },
                { value: "6", periodo: "04" },
                { value: "7", periodo: "05" },
              ],
              precipitacion: [{ value: "0", periodo: "00" }],
              vientoAndRachaMax: [{ value: "0", periodo: "00" }],
              humedadRelativa: [{ value: "0", periodo: "00" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.temperature.actual).toBe("7");
      jest.useRealTimers();
    });

    it("should return current temperature for hour 12 (noon) when now is 12", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 12, 0, 0)); // 12:00

      const external = createMockExternalMunicipality({
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
                { value: "10", periodo: "02" },
                { value: "12", periodo: "03" },
                { value: "14", periodo: "04" },
                { value: "16", periodo: "05" },
                { value: "18", periodo: "06" },
                { value: "19", periodo: "07" },
                { value: "20", periodo: "08" },
                { value: "19", periodo: "09" },
                { value: "18", periodo: "10" },
                { value: "15", periodo: "11" },
                { value: "12", periodo: "12" },
              ],
              precipitacion: [{ value: "0", periodo: "12" }],
              vientoAndRachaMax: [{ value: "0", periodo: "12" }],
              humedadRelativa: [{ value: "0", periodo: "12" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.temperature.actual).toBe("12");
      jest.useRealTimers();
    });

    it("should return current temperature for hour 23 (late evening) when now is 23", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 23, 45, 0)); // 23:45

      const external = createMockExternalMunicipality({
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
                { value: "15", periodo: "03" },
                { value: "18", periodo: "04" },
                { value: "20", periodo: "05" },
                { value: "22", periodo: "06" },
                { value: "23", periodo: "07" },
                { value: "23", periodo: "08" },
                { value: "22", periodo: "09" },
                { value: "20", periodo: "10" },
                { value: "18", periodo: "11" },
                { value: "15", periodo: "12" },
                { value: "12", periodo: "13" },
                { value: "10", periodo: "14" },
                { value: "8", periodo: "15" },
                { value: "7", periodo: "16" },
                { value: "6", periodo: "17" },
                { value: "5", periodo: "18" },
                { value: "4", periodo: "19" },
                { value: "3", periodo: "20" },
                { value: "2", periodo: "21" },
                { value: "1", periodo: "22" },
                { value: "1", periodo: "23" },
              ],
              precipitacion: [{ value: "0", periodo: "23" }],
              vientoAndRachaMax: [{ value: "0", periodo: "23" }],
              humedadRelativa: [{ value: "0", periodo: "23" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.temperature.actual).toBe("1");
      jest.useRealTimers();
    });

    it("should handle periodo 24 as hour 0", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 0, 30, 0)); // 00:30

      const external = createMockExternalMunicipality({
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
                { value: "5", periodo: "24" },
                { value: "8", periodo: "01" },
              ],
              precipitacion: [{ value: "10", periodo: "24" }],
              vientoAndRachaMax: [{ value: "15", periodo: "24" }],
              humedadRelativa: [{ value: "60", periodo: "24" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.temperature.actual).toBe("5");
      jest.useRealTimers();
    });

    it("should return N/A for current temperature when no matching hour is found", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 6, 0, 0)); // 06:00

      const external = createMockExternalMunicipality({
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
                { value: "10", periodo: "02" },
              ],
              precipitacion: [{ value: "0", periodo: "00" }],
              vientoAndRachaMax: [{ value: "0", periodo: "00" }],
              humedadRelativa: [{ value: "0", periodo: "00" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.temperature.actual).toBe("N/A");
      jest.useRealTimers();
    });

    it("should return current rain probability for hour 0 (midnight) when now is 0", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 0, 30, 0)); // 00:30

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "4", periodo: "00" }],
              precipitacion: [{ value: "5", periodo: "00" }],
              vientoAndRachaMax: [{ value: "10", periodo: "00" }],
              humedadRelativa: [{ value: "70", periodo: "00" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.rainProbability).toBe("5");
      jest.useRealTimers();
    });

    it("should return current rain probability for hour 5 when now is 5", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 5, 15, 0)); // 05:15

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "5", periodo: "05" }],
              precipitacion: [{ value: "25", periodo: "05" }],
              vientoAndRachaMax: [{ value: "5", periodo: "05" }],
              humedadRelativa: [{ value: "75", periodo: "05" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.rainProbability).toBe("25");
      jest.useRealTimers();
    });

    it("should return current rain probability for hour 12 (noon) when now is 12", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 12, 0, 0)); // 12:00

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "5", periodo: "12" }],
              precipitacion: [{ value: "30", periodo: "12" }],
              vientoAndRachaMax: [{ value: "12", periodo: "12" }],
              humedadRelativa: [{ value: "55", periodo: "12" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.rainProbability).toBe("30");
      jest.useRealTimers();
    });

    it("should return current rain probability for hour 23 (late evening) when now is 23", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 23, 45, 0)); // 23:45

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "5", periodo: "23" }],
              precipitacion: [{ value: "5", periodo: "23" }],
              vientoAndRachaMax: [{ value: "3", periodo: "23" }],
              humedadRelativa: [{ value: "85", periodo: "23" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.rainProbability).toBe("5");
      jest.useRealTimers();
    });

    it("should return current wind for hour 0 (midnight) when now is 0", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 0, 30, 0)); // 00:30

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "4", periodo: "00" }],
              precipitacion: [{ value: "5", periodo: "00" }],
              vientoAndRachaMax: [{ value: "12", periodo: "00" }],
              humedadRelativa: [{ value: "70", periodo: "00" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.wind).toBe("12");
      jest.useRealTimers();
    });

    it("should return current wind for hour 5 when now is 5", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 5, 15, 0)); // 05:15

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "7", periodo: "05" }],
              precipitacion: [{ value: "25", periodo: "05" }],
              vientoAndRachaMax: [{ value: "18", periodo: "05" }],
              humedadRelativa: [{ value: "75", periodo: "05" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.wind).toBe("18");
      jest.useRealTimers();
    });

    it("should return current wind for hour 12 (noon) when now is 12", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 12, 0, 0)); // 12:00

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "12", periodo: "12" }],
              precipitacion: [{ value: "30", periodo: "12" }],
              vientoAndRachaMax: [{ value: "22", periodo: "12" }],
              humedadRelativa: [{ value: "55", periodo: "12" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.wind).toBe("22");
      jest.useRealTimers();
    });

    it("should return current wind for hour 23 (late evening) when now is 23", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 23, 45, 0)); // 23:45

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "1", periodo: "23" }],
              precipitacion: [{ value: "5", periodo: "23" }],
              vientoAndRachaMax: [{ value: "3", periodo: "23" }],
              humedadRelativa: [{ value: "85", periodo: "23" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.wind).toBe("3");
      jest.useRealTimers();
    });

    it("should return current humidity for hour 0 (midnight) when now is 0", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 0, 30, 0)); // 00:30

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "4", periodo: "00" }],
              precipitacion: [{ value: "5", periodo: "00" }],
              vientoAndRachaMax: [{ value: "10", periodo: "00" }],
              humedadRelativa: [{ value: "75", periodo: "00" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.humidity).toBe("75");
      jest.useRealTimers();
    });

    it("should return current humidity for hour 5 when now is 5", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 5, 15, 0)); // 05:15

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "7", periodo: "05" }],
              precipitacion: [{ value: "25", periodo: "05" }],
              vientoAndRachaMax: [{ value: "18", periodo: "05" }],
              humedadRelativa: [{ value: "80", periodo: "05" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.humidity).toBe("80");
      jest.useRealTimers();
    });

    it("should return current humidity for hour 12 (noon) when now is 12", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 12, 0, 0)); // 12:00

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "12", periodo: "12" }],
              precipitacion: [{ value: "30", periodo: "12" }],
              vientoAndRachaMax: [{ value: "22", periodo: "12" }],
              humedadRelativa: [{ value: "45", periodo: "12" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.humidity).toBe("45");
      jest.useRealTimers();
    });

    it("should return current humidity for hour 23 (late evening) when now is 23", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 23, 45, 0)); // 23:45

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "1", periodo: "23" }],
              precipitacion: [{ value: "5", periodo: "23" }],
              vientoAndRachaMax: [{ value: "3", periodo: "23" }],
              humedadRelativa: [{ value: "92", periodo: "23" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.humidity).toBe("92");
      jest.useRealTimers();
    });
  });

  describe("Edge cases - data filtering and handling", () => {
    it("should filter out wind data with empty value or missing periodo", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 2, 12, 0, 30, 0)); // 00:30

      const external = createMockExternalMunicipality({
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "10", periodo: "00" }],
              precipitacion: [{ value: "10", periodo: "00" }],
              vientoAndRachaMax: [{ value: "15", periodo: "00" }],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
            {
              temperatura: [{ value: "5", periodo: "00" }],
              precipitacion: [{ value: "0", periodo: "00" }],
              vientoAndRachaMax: [
                { value: "", periodo: "00" }, // Empty value
                { value: "15", periodo: "" }, // Empty periodo
                { value: "20", periodo: "00" }, // Valid
              ],
              humedadRelativa: [{ value: "60", periodo: "00" }],
            },
          ],
        },
      });

      const result = mapToMunicipalityWithWeatherData(external);

      expect(result.weatherData.wind).toBe("20");
      jest.useRealTimers();
    });
  });
});
