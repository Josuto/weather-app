import { useBrowserStore } from "@hooks/UseBrowserStore";
import { renderHook } from "@testing-library/react";
import { municipalityFixture } from "@type/Municipality";
import { remove, save } from "@util/BrowserStorage";

describe("Given the UseBrowserStore hook", () => {
  const municipality = municipalityFixture();

  beforeEach(() => {
    remove(municipality.id);
  });

  describe("when there are no municipalities stored in the browser local storage", () => {
    it("should return an empty list of municipalities", () => {
      const { result } = renderHook(() => useBrowserStore());

      expect(result.current.length()).toBe(0);
    });
  });

  describe("when there are only municipalities stored in the browser local storage", () => {
    it("should return them", () => {
      save(municipality);

      const { result } = renderHook(() => useBrowserStore());

      expect(result.current.length()).toBe(1);
    });
  });

  describe("when there are municipalities altogether with other data stored in the browser local storage", () => {
    it("should only return the list of municipalities", () => {
      localStorage.setItem("hello", "world");
      save(municipality);

      const { result } = renderHook(() => useBrowserStore());

      expect(result.current.length()).toBe(1);
    });
  });
});
