import {render, screen} from "@testing-library/react";
import App from "./App";
import {municipalityFixture} from "./types/Municipality";
import userEvent from "@testing-library/user-event";
import {municipalityWithWeatherDataOrErrorFixture} from "./types/MunicipalityWithWeatherData";

const mockMunicipalities = [municipalityFixture()];
const mockMunicipalityWithWeatherDataOrError =
  municipalityWithWeatherDataOrErrorFixture();

jest.mock("./hooks/UseFetchMunicipalities", () => ({
  useFetchMunicipalities: () => mockMunicipalities,
}));

jest.mock("./hooks/UseFetchMunicipalityWithWeatherData", () => ({
  useFetchMunicipalityWithWeatherData: () => mockMunicipalityWithWeatherDataOrError,
}));

async function selectMunicipalityFromSearchBar(): Promise<void> {
  const municipalitySearch = screen.getByRole("combobox");
  userEvent.click(municipalitySearch);
  const [municipalityOption] = await screen.findAllByRole("option");
  userEvent.click(municipalityOption);
}

describe("Given the weather app", () => {
  describe("when the app is loaded for the first time", () => {
    describe("and no municipalities have been previously saved", () => {
      it("should include a municipalities search bar and no municipalities", async () => {
        render(<App />);

        const municipalitySearch = screen.getByRole("combobox");
        expect(municipalitySearch).toBeInTheDocument();

        const municipalityCards = screen.queryAllByText("Some municipality");
        expect(municipalityCards).toHaveLength(0);
      });
    });

    describe("and a municipality has been previously saved", () => {
      it("should include a municipalities search bar and one municipality", async () => {
        const municipality = municipalityFixture();
        localStorage.setItem(
          municipality.id,
          JSON.stringify(municipality.getIdentifiers())
        );
        render(<App />);

        const municipalitySearch = screen.getByRole("combobox");
        expect(municipalitySearch).toBeInTheDocument();

        const municipalityCards = screen.queryAllByText("Some municipality");
        expect(municipalityCards).toHaveLength(1);
      });
    });
  });

  describe("when the user selects a municipality in the search bar", () => {
    it("should add a municipality card to the page", async () => {
      render(<App />);

      await selectMunicipalityFromSearchBar();

      const municipalityCards = screen.queryAllByText("Some municipality");
      expect(municipalityCards).toHaveLength(1);
    });
  });

  describe("when the user closes a municipality card", () => {
    it("should remove the municipality card from the page", async () => {
      render(<App />);

      await selectMunicipalityFromSearchBar();
      const municipalityCardCloseButton = screen.getByRole("button", {
        name: "Close",
      });
      userEvent.click(municipalityCardCloseButton);

      const municipalityCards = screen.queryAllByText("Some municipality");
      expect(municipalityCards).toHaveLength(0);
    });
  });
});
