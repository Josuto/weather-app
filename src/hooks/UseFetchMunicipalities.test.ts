import { renderHook } from "@testing-library/react";
import { Municipality, municipalityFixture } from "@type/Municipality";
import useSWR from "swr";
import { useFetchMunicipalities } from "./UseFetchMunicipalities";

jest.mock("swr");

describe("Given the UseFetchMunicipalities hook", () => {
  describe("when the external service reports an error", () => {
    it("should return an empty list of municipalities", () => {
      // @ts-expect-error --- IGNORE ---
      useSWR.mockReturnValueOnce({
        data: undefined,
        error: new Error("Service unavailable"),
      });

      const { result } = renderHook(() => useFetchMunicipalities());

      expect(result.current.municipalities.length).toBe(0);
    });
  });

  describe("when the external service the external service returns a list of (unordered) municipalities", () => {
    it("should return a list of municipalities ordered by name", () => {
      const externalMunicipality: Municipality = {
        id: "00001",
        name: "Some municipality",
      };

      const anotherExternalMunicipality: Municipality = {
        id: "00002",
        name: "Another municipality",
      };

      // @ts-expect-error --- IGNORE ---
      useSWR.mockReturnValueOnce({
        data: { municipalities: [externalMunicipality, anotherExternalMunicipality] },
        error: undefined,
      });

      const { result } = renderHook(() => useFetchMunicipalities());

      expect(result.current.municipalities).toEqual({
        municipalities: [
          municipalityFixture({ id: "00001", name: "Some municipality" }),
          municipalityFixture({ id: "00002", name: "Another municipality" }),
        ],
      });
    });
  });
});
