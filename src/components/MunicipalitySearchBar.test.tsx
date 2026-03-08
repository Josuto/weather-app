import { MunicipalitySearchBar } from "@components/MunicipalitySearchBar";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Municipalities } from "@type/Municipalities";
import { municipalityFixture } from "@type/Municipality";

const mockMunicipalities = jest.fn();

jest.mock("../hooks/UseFetchMunicipalities", () => ({
  useFetchMunicipalities: () => mockMunicipalities(),
}));

async function clickOnMunicipalitySearchBar(): Promise<void> {
  const municipalitySearchBar = screen.getByRole("combobox");
  await userEvent.click(municipalitySearchBar);
}

async function pickMunicipalityAtSearchBar(): Promise<void> {
  const [municipalityOption] = screen.queryAllByRole("option");
  await userEvent.click(municipalityOption);
}

describe("Given the municipality search bar component", () => {
  describe("when there are no municipalities to select from", () => {
    it("should not display any of them", () => {
      mockMunicipalities.mockReturnValueOnce([]);

      render(
        <MunicipalitySearchBar
          onChange={() => {}}
          municipalities={new Municipalities([])}
        />
      );

      clickOnMunicipalitySearchBar();

      const municipalityOptions = screen.queryAllByRole("option");
      expect(municipalityOptions).toHaveLength(0);
    });
  });

  describe("when there are municipalities to select from", () => {
    describe("and none has been selected yet", () => {
      it("should display all of them", async () => {
        const municipality = municipalityFixture();
        const anotherMunicipality = municipalityFixture({
          id: "00002",
          name: "Another municipality",
        });

        mockMunicipalities.mockReturnValueOnce({
          municipalities: [municipality, anotherMunicipality],
        });

        render(
          <MunicipalitySearchBar
            onChange={() => {}}
            municipalities={new Municipalities()}
          />
        );

        clickOnMunicipalitySearchBar();

        const municipalityOptions = await screen.findAllByRole("option");
        expect(municipalityOptions).toHaveLength(2);
        expect(municipalityOptions[0]).toHaveTextContent(municipality.name);
        expect(municipalityOptions[1]).toHaveTextContent(anotherMunicipality.name);
      });
    });

    describe("and one has already been selected", () => {
      it("should display all of them but the one selected", async () => {
        const municipality = municipalityFixture();
        const anotherMunicipality = municipalityFixture({
          id: "00002",
          name: "Another municipality",
        });

        mockMunicipalities.mockReturnValueOnce({
          municipalities: [municipality, anotherMunicipality],
        });

        render(
          <MunicipalitySearchBar
            onChange={() => {}}
            municipalities={new Municipalities([municipality])}
          />
        );

        clickOnMunicipalitySearchBar();
        pickMunicipalityAtSearchBar();
        clickOnMunicipalitySearchBar();

        const municipalityOptions = await screen.findAllByRole("option");
        expect(municipalityOptions).toHaveLength(1);
        expect(municipalityOptions[0]).toHaveTextContent(anotherMunicipality.name);
      });
    });
  });
});
