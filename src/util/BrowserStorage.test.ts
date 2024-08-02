import { Municipality, municipalityFixture } from "@type/Municipality";
import { get, remove, save } from "@util/BrowserStorage";

describe("Browser storage utils", () => {
  const municipality = municipalityFixture();

  describe("given the get municipality function", () => {
    describe("when it receives an undefined value", () => {
      it("should return null", () => {
        expect(get(undefined as unknown as string)).toBeNull();
      });
    });

    describe("when it receives a null value", () => {
      it("should return null", () => {
        expect(get(null as unknown as string)).toBeNull();
      });
    });

    describe("when it receives an ID that does not conform to the format of municipality ID", () => {
      it("should return null", () => {
        expect(get("test")).toBeNull();
      });
    });

    describe("when it receives an ID that does not match a saved municipality", () => {
      it("should return null", () => {
        expect(get("00000")).toBeNull();
      });
    });

    describe("when it receives an ID that matches a saved municipality", () => {
      beforeEach(() => {
        save(municipality);
      });

      afterEach(() => {
        remove(municipality.id);
      });

      it("should return the saved municipality", () => {
        expect(get(municipality.id)).toEqual(municipality);
      });
    });
  });

  describe("given the save municipality function", () => {
    describe("when it receives an undefined value", () => {
      it("should throw an error", () => {
        expect(() => save(undefined as unknown as Municipality)).toThrowError();
      });
    });

    describe("when it receives a null value", () => {
      it("should throw an error", () => {
        expect(() => save(null as unknown as Municipality)).toThrowError();
      });
    });

    describe("when it receives a valid municipality", () => {
      it("should return true", () => {
        expect(save(municipality)).toBe(true);
      });
    });
  });

  describe("given the remove municipality function", () => {
    describe("when it receives an undefined value", () => {
      it("should return false", () => {
        expect(remove(undefined as unknown as string)).toBe(false);
      });
    });

    describe("when it receives a null value", () => {
      it("should return false", () => {
        expect(remove(null as unknown as string)).toBe(false);
      });
    });

    describe("when it receives an ID that does not conform to the format of municipality ID", () => {
      it("should return false", () => {
        expect(remove("test")).toBe(false);
      });
    });

    describe("when it receives an ID that does not match a saved municipality", () => {
      it("should return false", () => {
        expect(remove("00000")).toBe(false);
      });
    });

    describe("when it receives an ID that matches a saved municipality", () => {
      beforeEach(() => {
        save(municipality);
      });

      it("should return true", () => {
        expect(remove(municipality.id)).toBe(true);
      });
    });
  });
});
