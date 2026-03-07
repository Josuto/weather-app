import { useFetchMunicipalityWithWeatherData } from "@hooks/UseFetchMunicipalityWithWeatherData";
import { renderHook } from "@testing-library/react";
import { municipalityWithWeatherDataFixture } from "@type/MunicipalityWithWeatherData";
import useSWR from "swr";

jest.mock("swr");

describe("Given the UseFetchMunicipalityWithWeatherData hook", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("when the given municipality is null", () => {
    it("should throw an error", () => {
      expect(() =>
        useFetchMunicipalityWithWeatherData(null as unknown as string)
      ).toThrow();
    });
  });

  describe("when the given municipality is undefined", () => {
    it("should throw an error", () => {
      expect(() =>
        useFetchMunicipalityWithWeatherData(undefined as unknown as string)
      ).toThrow();
    });
  });

  describe("when the given municipality is valid", () => {
    describe("and the external service reports an error", () => {
      it("should return both the municipality and the error", () => {
        // @ts-expect-error --- IGNORE ---
        useSWR.mockReturnValueOnce({
          data: undefined,
          error: new Error("Service unavailable"),
        });

        const { result } = renderHook(() => useFetchMunicipalityWithWeatherData("00001"));

        expect(result.current.municipalityWithWeatherData).toBeUndefined();
        expect(result.current.error).not.toBeUndefined();
      });
    });

    describe("and the external service returns the weather data for the municipality", () => {
      it("should return the municipality with its associated weather data", () => {
        const municipalityWithWeatherData = municipalityWithWeatherDataFixture();
        // @ts-expect-error --- IGNORE ---
        useSWR.mockReturnValueOnce({
          data: { municipalityWithWeatherData: municipalityWithWeatherData },
          error: undefined,
        });

        const { result } = renderHook(() => useFetchMunicipalityWithWeatherData("00001"));

        expect(result.current.municipalityWithWeatherData).toEqual({
          municipalityWithWeatherData,
        });
        expect(result.current.error).toBeUndefined();
      });
    });
  });
});
