import {Municipality, municipalityFixture} from "../types/Municipality";
import useSWR from "swr";
import {renderHook} from "@testing-library/react";
import {useFetchMunicipalityWithWeatherData} from "./UseFetchMunicipalityWithWeatherData";
import {municipalityWithWeatherDataFixture} from "../types/MunicipalityWithWeatherData";

jest.mock("swr");

describe("Given the UseFetchMunicipalityWithWeatherData hook", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("when the given municipality is null", () => {
    it("should throw an error", () => {
      expect(() =>
        useFetchMunicipalityWithWeatherData(null as unknown as Municipality)
      ).toThrowError();
    });
  });

  describe("when the given municipality is undefined", () => {
    it("should throw an error", () => {
      expect(() =>
        useFetchMunicipalityWithWeatherData(undefined as unknown as Municipality)
      ).toThrowError();
    });
  });

  describe("when the given municipality is valid", () => {
    const municipality = municipalityFixture();

    describe("and the external service reports an error", () => {
      it("should return both the municipality and the error", () => {
        // @ts-ignore
        useSWR.mockReturnValueOnce({
          data: undefined,
          error: new Error("Service unavailable"),
        });

        const {result} = renderHook(() =>
          useFetchMunicipalityWithWeatherData(municipality)
        );

        expect(result.current.data).toEqual(municipality);
        expect(result.current.error).not.toBeUndefined();
      });
    });

    describe("and the external service returns the weather data for the municipality", () => {
      it("should return the municipality with its associated weather data", () => {
        const municipalityWithWeatherData = municipalityWithWeatherDataFixture();
        // @ts-ignore
        useSWR.mockReturnValueOnce({
          data: {
            temperatura_actual: "5",
            temperaturas: {max: "10", min: "2"},
            humedad: "47",
            viento: "30",
            lluvia: "5",
          },
          error: undefined,
        });

        const {result} = renderHook(() =>
          useFetchMunicipalityWithWeatherData(municipality)
        );

        expect(result.current.data).toEqual(municipalityWithWeatherData);
        expect(result.current.error).toBeUndefined();
      });
    });
  });
});
