import useSWR from "swr";
import {renderHook} from "@testing-library/react";
import {ExternalMunicipality, useFetchMunicipalities} from "./UseFetchMunicipalities";
import {anotherMunicipalityFixture, municipalityFixture} from "../types/Municipality";

jest.mock("swr");

describe("Given the UseFetchMunicipalities hook", () => {
  describe("when the external service reports an error", () => {
    it("should return an empty list of municipalities", () => {
      // @ts-ignore
      useSWR.mockReturnValueOnce({
        data: undefined,
        error: new Error("Service unavailable"),
      });

      const {result} = renderHook(() => useFetchMunicipalities());

      expect(result.current.length).toBe(0);
    });
  });

  describe("when the external service the external service returns a list of unordered municipalities", () => {
    it("should return a list of ordered municipalities", () => {
      const externalMunicipality: ExternalMunicipality = {
        CODIGOINE: "00001",
        CODPROV: "01",
        NOMBRE: "Some municipality",
        NOMBRE_PROVINCIA: "Some province",
      };

      const anotherExternalMunicipality: ExternalMunicipality = {
        CODIGOINE: "00002",
        CODPROV: "01",
        NOMBRE: "Another municipality",
        NOMBRE_PROVINCIA: "Some province",
      };

      // @ts-ignore
      useSWR.mockReturnValueOnce({
        data: [externalMunicipality, anotherExternalMunicipality],
        error: undefined,
      });

      const {result} = renderHook(() => useFetchMunicipalities());

      expect(result.current).toEqual([
        anotherMunicipalityFixture(),
        municipalityFixture(),
      ]);
    });
  });
});
