import { fetchMunicipalityWithWeatherData } from "@infrastructure/FetchMunicipalityWithWeatherData";
import { municipalityWithWeatherDataFixture } from "@type/MunicipalityWithWeatherData";
import { ExternalMunicipalityWithWeatherData } from "@infrastructure/ExternalMunicipalityWithWeatherData";

// Mock the fetch function
global.fetch = jest.fn();

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
}));

jest.mock("@infrastructure/FetchInitialLink");
jest.mock("@util/DecodeResult");
jest.mock("@infrastructure/ExternalMunicipalityWithWeatherData");

import { fetchInitialLink } from "@infrastructure/FetchInitialLink";
import { decode } from "@util/DecodeResult";
import { mapToMunicipalityWithWeatherData } from "@infrastructure/ExternalMunicipalityWithWeatherData";

describe("Given the fetch municipality with weather data function", () => {
  const mockMunicipality = "28001";
  const mockDatosUrl = "https://example.com/weather/28001";
  const mockMappedData = municipalityWithWeatherDataFixture();

  describe("Happy path", () => {
    beforeEach(() => {
      // Clear previous mock history to prevent leakage
      jest.clearAllMocks();

      // Mock the initial link fetch
      (fetchInitialLink as jest.Mock).mockResolvedValueOnce(mockDatosUrl);

      // Create mock external data to decode
      const mockExternalData: ExternalMunicipalityWithWeatherData = {
        id: `id${mockMunicipality}`,
        nombre: mockMappedData.name,
        provincia: mockMappedData.province,
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "5", periodo: "0" }],
              precipitacion: [{ value: "5", periodo: "0" }],
              vientoAndRachaMax: [{ value: "30", periodo: "0" }],
              humedadRelativa: [{ value: "47", periodo: "0" }],
            },
          ],
        },
      };

      // Mock decode to return the external data
      (decode as jest.Mock).mockResolvedValueOnce([mockExternalData]);

      // Mock mapToMunicipalityWithWeatherData to return mapped data
      (mapToMunicipalityWithWeatherData as jest.Mock).mockReturnValueOnce(mockMappedData);

      // Mock the actual fetch for the data request
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => {
          const encoded = Buffer.from(JSON.stringify(mockExternalData), "latin1");
          return encoded.buffer.slice(
            encoded.byteOffset,
            encoded.byteOffset + encoded.byteLength
          );
        },
      });
    });

    it("should return municipality with weather data when request succeeds", async () => {
      const result = await fetchMunicipalityWithWeatherData(mockMunicipality);

      expect(result).toEqual(mockMappedData);
      expect(fetchInitialLink).toHaveBeenCalledWith(
        `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${mockMunicipality}`
      );
      expect(global.fetch).toHaveBeenCalledWith(mockDatosUrl, { cache: "no-store" });
      expect(decode).toHaveBeenCalled();
      expect(mapToMunicipalityWithWeatherData).toHaveBeenCalled();
    });

    it("should fetch weather data using the correct municipality ID", async () => {
      const municipalityId = "28079";
      (fetchInitialLink as jest.Mock).mockClear();
      (fetchInitialLink as jest.Mock).mockResolvedValueOnce(mockDatosUrl);

      await fetchMunicipalityWithWeatherData(municipalityId);

      expect(fetchInitialLink).toHaveBeenCalledWith(
        `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${municipalityId}`
      );
    });
  });

  describe("Error cases - fetchInitialLink", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw an error when initial link request fails with network error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchMunicipalityWithWeatherData(mockMunicipality)).rejects.toThrow(
        "Network error"
      );
    });

    it("should throw an error when initial link request returns non-ok response", async () => {
      (fetchInitialLink as jest.Mock).mockRejectedValueOnce(new Error("Unauthorized"));

      await expect(fetchMunicipalityWithWeatherData(mockMunicipality)).rejects.toThrow(
        "Unauthorized"
      );
    });

    it("should throw an error when API returns 403 Forbidden", async () => {
      (fetchInitialLink as jest.Mock).mockRejectedValueOnce(new Error("Forbidden"));

      await expect(fetchMunicipalityWithWeatherData(mockMunicipality)).rejects.toThrow(
        "Forbidden"
      );
    });

    it("should throw an error when initial response JSON is invalid", async () => {
      (fetchInitialLink as jest.Mock).mockRejectedValueOnce(new Error("Invalid JSON"));

      await expect(fetchMunicipalityWithWeatherData(mockMunicipality)).rejects.toThrow(
        "Invalid JSON"
      );
    });
  });

  describe("Error cases - fetchMunicipalityWithWeatherDataFrom", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw an error when weather data request fails with network error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network timeout"));

      await expect(fetchMunicipalityWithWeatherData(mockMunicipality)).rejects.toThrow(
        "Failed to fetch municipality with weather data: Network timeout"
      );
    });

    it("should throw an error when weather data request returns non-ok response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(fetchMunicipalityWithWeatherData(mockMunicipality)).rejects.toThrow(
        "Failed to fetch municipality with weather data: Not Found"
      );
    });

    it("should throw an error when weather data request returns 403 Forbidden", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Forbidden",
      });

      await expect(fetchMunicipalityWithWeatherData(mockMunicipality)).rejects.toThrow(
        "Failed to fetch municipality with weather data: Forbidden"
      );
    });

    it("should throw an error when decode fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => Buffer.alloc(0),
      });

      (decode as jest.Mock).mockRejectedValueOnce(new Error("Failed to decode response"));

      await expect(fetchMunicipalityWithWeatherData(mockMunicipality)).rejects.toThrow(
        "Failed to decode response"
      );
    });

    it("should throw an error when mapToMunicipalityWithWeatherData fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => Buffer.alloc(0),
      });

      const mockExternalData: ExternalMunicipalityWithWeatherData = {
        id: `id${mockMunicipality}`,
        nombre: "Test",
        provincia: "Test",
        prediccion: {
          dia: [
            {
              temperatura: [{ value: "5", periodo: "0" }],
              precipitacion: [{ value: "5", periodo: "0" }],
              vientoAndRachaMax: [{ value: "30", periodo: "0" }],
              humedadRelativa: [{ value: "47", periodo: "0" }],
            },
          ],
        },
      };

      (decode as jest.Mock).mockResolvedValueOnce([mockExternalData]);
      (mapToMunicipalityWithWeatherData as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Invalid data structure");
      });

      await expect(fetchMunicipalityWithWeatherData(mockMunicipality)).rejects.toThrow(
        "Invalid data structure"
      );
    });
  });

  describe("Error cases - fetch with no-store cache", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (fetchInitialLink as jest.Mock).mockResolvedValueOnce(mockDatosUrl);
    });

    it("should use cache: 'no-store' when fetching weather data", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => Buffer.alloc(0),
      });

      (decode as jest.Mock).mockResolvedValueOnce([{}]);
      (mapToMunicipalityWithWeatherData as jest.Mock).mockReturnValueOnce(mockMappedData);

      await fetchMunicipalityWithWeatherData(mockMunicipality);

      expect(global.fetch).toHaveBeenCalledWith(mockDatosUrl, { cache: "no-store" });
    });
  });
});
