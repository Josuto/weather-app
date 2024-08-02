import { renderHook } from "@testing-library/react";
import { municipalityFixture } from "@type/Municipality";
import useSWR from "swr";
import { ExternalMunicipality, useFetchMunicipalities } from "./UseFetchMunicipalities";

jest.mock("swr");

describe("Given the UseFetchMunicipalities hook", () => {
  describe("when the external service reports an error", () => {
    it("should return an empty list of municipalities", () => {
      // @ts-ignore
      useSWR.mockReturnValueOnce({
        data: undefined,
        error: new Error("Service unavailable"),
      });

      const { result } = renderHook(() => useFetchMunicipalities());

      expect(result.current.length).toBe(0);
    });
  });

  describe("when the external service the external service returns a list of (unordered) municipalities", () => {
    it("should return a list of municipalities ordered by name", () => {
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
        data: { municipios: [externalMunicipality, anotherExternalMunicipality] },
        error: undefined,
      });

      const { result } = renderHook(() => useFetchMunicipalities());

      expect(result.current).toEqual([
        municipalityFixture({ id: "00002", name: "Another municipality" }),
        municipalityFixture(),
      ]);
    });
  });
});
