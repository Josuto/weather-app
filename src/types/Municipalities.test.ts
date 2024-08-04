import { Municipalities } from "./Municipalities";
import { municipalityFixture } from "./Municipality";

describe("Given the municipalities wrapper", () => {
  describe("when retrieving the list of municipality IDs", () => {
    describe("of an empty list of municipalities", () => {
      it("should return an empty list of IDs", () => {
        const ids = new Municipalities().getIds();
        expect(ids).toEqual([]);
      });
    });

    describe("of a list of municipalities", () => {
      it("should return a list of IDs", () => {
        const municipality = municipalityFixture();
        const ids = new Municipalities([municipality]).getIds();
        expect(ids).toEqual([municipality.id]);
      });
    });
  });

  describe("when removing a municipality by municipality ID", () => {
    let municipalities: Municipalities;
    const municipality = municipalityFixture();

    beforeEach(() => {
      municipalities = new Municipalities([municipality]);
    });

    describe("and the ID does not match any existing municipality", () => {
      it("should return a municipalities wrapper with same contents as the original", () => {
        const remainingMunicipalities = municipalities.removeById("0002");
        expect(remainingMunicipalities).toEqual(municipalities);
      });
    });

    describe("and the ID matches an existing municipality", () => {
      it("should return a municipalities wrapper not including such a municipality", () => {
        const remainingMunicipalities = municipalities.removeById(municipality.id);
        expect(remainingMunicipalities).toEqual(new Municipalities([]));
      });
    });
  });

  describe("when adding a municipality", () => {
    let municipalities: Municipalities;

    beforeEach(() => {
      municipalities = new Municipalities([]);
    });

    describe("that is null", () => {
      it("should return a municipalities wrapper with same contents as the original", () => {
        const updatedMunicipalities = municipalities.add(null);
        expect(updatedMunicipalities).toEqual(municipalities);
      });
    });

    describe("that is not null", () => {
      it("should return a municipalities wrapper including the new municipality", () => {
        const municipality = municipalityFixture();

        const updatedMunicipalities = municipalities.add(municipality);
        expect(updatedMunicipalities).toEqual(new Municipalities([municipality]));
      });
    });
  });

  describe("when calculating the length", () => {
    describe("of an empty list of wrapped municipalities", () => {
      it("should result in zero", () => {
        const municipalities = new Municipalities();
        expect(municipalities.length()).toBe(0);
      });
    });

    describe("of a list of wrapped municipalities", () => {
      it("should result in the amount of such a list", () => {
        const municipalities = new Municipalities([municipalityFixture()]);
        expect(municipalities.length()).toBe(1);
      });
    });
  });

  it("should enable iterating through municipalities using a for statement", () => {
    const municipalities = new Municipalities([municipalityFixture()]);
    for (const municipality of municipalities) {
      expect(municipality).toEqual(municipalityFixture());
    }
  });

  it("should enable iterating through municipalities using the map function", () => {
    const municipalities = new Municipalities([municipalityFixture()]);
    municipalities.map((municipality) =>
      expect(municipality).toEqual(municipalityFixture())
    );
  });
});
