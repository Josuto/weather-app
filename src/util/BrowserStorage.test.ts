import { Municipality, municipalityFixture } from "@type/Municipality";
import {
  fetchStoredMunicipalities,
  fetchFromBrowserStorage,
  removeFromBrowserStorage,
  saveToBrowserStorage,
} from "@util/BrowserStorage";

describe("Browser storage utils", () => {
  const municipality = municipalityFixture();

  describe("given the get municipality function", () => {
    describe("when it receives an undefined value", () => {
      it("should return null", () => {
        expect(fetchFromBrowserStorage(undefined as unknown as string)).toBeNull();
      });
    });

    describe("when it receives a null value", () => {
      it("should return null", () => {
        expect(fetchFromBrowserStorage(null as unknown as string)).toBeNull();
      });
    });

    describe("when it receives an ID that does not conform to the format of municipality ID", () => {
      it("should return null", () => {
        expect(fetchFromBrowserStorage("test")).toBeNull();
      });
    });

    describe("when it receives an ID that does not match a saved municipality", () => {
      it("should return null", () => {
        expect(fetchFromBrowserStorage("00000")).toBeNull();
      });
    });

    describe("when it receives an ID that matches a saved municipality", () => {
      beforeEach(() => {
        saveToBrowserStorage(municipality);
      });

      afterEach(() => {
        removeFromBrowserStorage(municipality.id);
      });

      it("should return the saved municipality", () => {
        expect(fetchFromBrowserStorage(municipality.id)).toEqual(municipality);
      });
    });
  });

  describe("given the save municipality function", () => {
    describe("when it receives an undefined value", () => {
      it("should throw an error", () => {
        expect(() =>
          saveToBrowserStorage(undefined as unknown as Municipality)
        ).toThrow();
      });
    });

    describe("when it receives a null value", () => {
      it("should throw an error", () => {
        expect(() => saveToBrowserStorage(null as unknown as Municipality)).toThrow();
      });
    });

    describe("when it receives a valid municipality", () => {
      it("should return true", () => {
        expect(saveToBrowserStorage(municipality)).toBe(true);
      });
    });
  });

  describe("given the remove municipality function", () => {
    describe("when it receives an undefined value", () => {
      it("should return false", () => {
        expect(removeFromBrowserStorage(undefined as unknown as string)).toBe(false);
      });
    });

    describe("when it receives a null value", () => {
      it("should return false", () => {
        expect(removeFromBrowserStorage(null as unknown as string)).toBe(false);
      });
    });

    describe("when it receives an ID that does not conform to the format of municipality ID", () => {
      it("should return false", () => {
        expect(removeFromBrowserStorage("test")).toBe(false);
      });
    });

    describe("when it receives an ID that does not match a saved municipality", () => {
      it("should return false", () => {
        expect(removeFromBrowserStorage("00000")).toBe(false);
      });
    });

    describe("when it receives an ID that matches a saved municipality", () => {
      beforeEach(() => {
        saveToBrowserStorage(municipality);
      });

      it("should return true", () => {
        expect(removeFromBrowserStorage(municipality.id)).toBe(true);
      });
    });
  });

  describe("Given the fetchMunicipalities function", () => {
    const municipality = municipalityFixture();

    beforeEach(() => {
      removeFromBrowserStorage(municipality.id);
    });

    describe("when there are no municipalities stored in the browser local storage", () => {
      it("should return an empty list of municipalities", () => {
        const result = fetchStoredMunicipalities();

        expect(result.length()).toBe(0);
      });
    });

    describe("when there are only municipalities stored in the browser local storage", () => {
      it("should return them", () => {
        saveToBrowserStorage(municipality);

        const result = fetchStoredMunicipalities();

        expect(result.length()).toBe(1);
      });
    });

    describe("when there are municipalities altogether with other data stored in the browser local storage", () => {
      it("should only return the list of municipalities", () => {
        localStorage.setItem("hello", "world");
        saveToBrowserStorage(municipality);

        const result = fetchStoredMunicipalities();

        expect(result.length()).toBe(1);
      });
    });
  });
});
