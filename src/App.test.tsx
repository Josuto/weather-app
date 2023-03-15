import {render, screen} from "@testing-library/react";
import App from "./App";
import {municipalityFixture} from "./types/Municipality";
import userEvent from "@testing-library/user-event";
import {municipalityWithWeatherDataOrErrorFixture} from "./types/MunicipalityWithWeatherData";
import {remove, save} from "./util/BrowserStorage";

const mockMunicipalities = [municipalityFixture()];
const mockMunicipalityWithWeatherDataOrError =
  municipalityWithWeatherDataOrErrorFixture();

jest.mock("./hooks/UseFetchMunicipalities", () => ({
  useFetchMunicipalities: () => mockMunicipalities,
}));

jest.mock("./hooks/UseFetchMunicipalityWithWeatherData", () => ({
  useFetchMunicipalityWithWeatherData: () => mockMunicipalityWithWeatherDataOrError,
}));

function clickOnMunicipalitySearchBar(): void {
  const municipalitySearch = screen.getByRole("combobox");
  userEvent.click(municipalitySearch);
}

async function selectMunicipalityFromSearchBar(): Promise<void> {
  clickOnMunicipalitySearchBar();
  const [municipalityOption] = await screen.findAllByRole("option");
  userEvent.click(municipalityOption);
}

function closeMunicipalityCard(): void {
  const municipalityCardCloseButton = screen.getByRole("button", {
    name: "Close",
  });
  userEvent.click(municipalityCardCloseButton);
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
      beforeEach(() => {
        const municipality = municipalityFixture();
        save(municipality);
      });

      afterEach(() => {
        const municipality = municipalityFixture();
        remove(municipality.id);
      });

      it("should include a municipalities search bar and one municipality", async () => {
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

    it("should remove the municipality from the search bar options", async () => {
      render(<App />);

      await selectMunicipalityFromSearchBar();
      clickOnMunicipalitySearchBar();

      const municipalities = screen.queryAllByRole("option");
      expect(municipalities).toHaveLength(0);
    });
  });

  describe("when the user closes a municipality card", () => {
    it("should remove the municipality card from the page", async () => {
      render(<App />);

      await selectMunicipalityFromSearchBar();
      closeMunicipalityCard();

      const municipalityCards = screen.queryAllByText("Some municipality");
      expect(municipalityCards).toHaveLength(0);
    });

    it("should add the municipality back to the search bar options", async () => {
      render(<App />);

      await selectMunicipalityFromSearchBar();
      closeMunicipalityCard();
      clickOnMunicipalitySearchBar();

      const municipalities = screen.queryAllByRole("option");
      expect(municipalities).toHaveLength(1);
    });
  });
});
