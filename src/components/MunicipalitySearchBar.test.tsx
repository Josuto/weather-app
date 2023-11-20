import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {municipalityFixture} from "../types/Municipality";
import {MunicipalitySearchBar} from "./MunicipalitySearchBar";

const mockMunicipalities = jest.fn();

jest.mock("../hooks/UseFetchMunicipalities", () => ({
  useFetchMunicipalities: () => mockMunicipalities(),
}));

function clickOnMunicipalitySearchBar(): void {
  const municipalitySearchBar = screen.getByRole("combobox");
  userEvent.click(municipalitySearchBar);
}

function pickMunicipalityAtSearchBar(): void {
  const [municipalityOption] = screen.queryAllByRole("option");
  userEvent.click(municipalityOption);
}

describe("Given the municipality search bar component", () => {
  describe("when there are no municipalities to select from", () => {
    it("should not display any of them", () => {
      mockMunicipalities.mockReturnValueOnce([]);

      render(<MunicipalitySearchBar onChange={() => {}} municipalities={[]} />);

      clickOnMunicipalitySearchBar();

      const municipalityOptions = screen.queryAllByRole("option");
      expect(municipalityOptions).toHaveLength(0);
    });
  });

  describe("when there are municipalities to select from", () => {
    describe("and none has been selected yet", () => {
      it("should display all of them", () => {
        const municipality = municipalityFixture();
        const anotherMunicipality = municipalityFixture({
          id: "00002",
          name: "Another municipality",
        });

        mockMunicipalities.mockReturnValueOnce([municipality, anotherMunicipality]);

        render(<MunicipalitySearchBar onChange={() => {}} municipalities={[]} />);

        clickOnMunicipalitySearchBar();

        const municipalityOptions = screen.queryAllByRole("option");
        expect(municipalityOptions).toHaveLength(2);
        expect(municipalityOptions[0]).toHaveTextContent(
          `${municipality.name} (${municipality.provinceName})`
        );
        expect(municipalityOptions[1]).toHaveTextContent(
          `${anotherMunicipality.name} (${anotherMunicipality.provinceName})`
        );
      });
    });

    describe("and one has already been selected", () => {
      it("should display all of them but the one selected", () => {
        const municipality = municipalityFixture();
        const anotherMunicipality = municipalityFixture({
          id: "00002",
          name: "Another municipality",
        });

        mockMunicipalities.mockReturnValueOnce([municipality, anotherMunicipality]);

        render(
          <MunicipalitySearchBar onChange={() => {}} municipalities={[municipality]} />
        );

        clickOnMunicipalitySearchBar();
        pickMunicipalityAtSearchBar();
        clickOnMunicipalitySearchBar();

        const municipalityOptions = screen.queryAllByRole("option");
        expect(municipalityOptions).toHaveLength(1);
        expect(municipalityOptions[0]).toHaveTextContent(
          `${anotherMunicipality.name} (${anotherMunicipality.provinceName})`
        );
      });
    });
  });
});
