import {render, screen} from "@testing-library/react";
import App from "./App";
import {municipalityFixture} from "./types/Municipality";
import userEvent from "@testing-library/user-event";
import {municipalityPayloadFixture} from "./types/MunicipalityWithWeatherData";
import {remove, save} from "./util/BrowserStorage";
import theme from "./styles/theme";
import {ThemeProvider} from "@mui/material";
import React from "react";

const mockMunicipalities = [municipalityFixture()];
const mockMunicipalityPayload = municipalityPayloadFixture();

jest.mock("./hooks/UseFetchMunicipalities", () => ({
  useFetchMunicipalities: () => mockMunicipalities,
}));

jest.mock("./hooks/UseFetchMunicipalityWithWeatherData", () => ({
  useFetchMunicipalityWithWeatherData: () => mockMunicipalityPayload,
}));

function clickOnMunicipalitySearchBar(): void {
  const municipalitySearch = screen.getByRole("combobox");
  userEvent.click(municipalitySearch);
}

async function pickMunicipalityAtSearchBar(): Promise<void> {
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
        render(
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        );

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
        render(
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        );

        const municipalitySearch = screen.getByRole("combobox");
        expect(municipalitySearch).toBeInTheDocument();

        const municipalityCards = screen.queryAllByText("Some municipality");
        expect(municipalityCards).toHaveLength(1);
      });
    });
  });

  describe("when the user selects a municipality in the search bar", () => {
    it("should add a municipality card to the page", async () => {
      render(
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      );

      await pickMunicipalityAtSearchBar();

      const municipalityCards = screen.queryAllByText("Some municipality");
      expect(municipalityCards).toHaveLength(1);
    });

    it("should remove the municipality from the search bar options", async () => {
      render(
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      );

      await pickMunicipalityAtSearchBar();
      clickOnMunicipalitySearchBar();

      const municipalities = screen.queryAllByRole("option");
      expect(municipalities).toHaveLength(0);
    });
  });

  describe("when the user closes a municipality card", () => {
    it("should remove the municipality card from the page", async () => {
      render(
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      );

      await pickMunicipalityAtSearchBar();
      closeMunicipalityCard();

      const municipalityCards = screen.queryAllByText("Some municipality");
      expect(municipalityCards).toHaveLength(0);
    });

    it("should add the municipality back to the search bar options", async () => {
      render(
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      );

      await pickMunicipalityAtSearchBar();
      closeMunicipalityCard();
      clickOnMunicipalitySearchBar();

      const municipalities = screen.queryAllByRole("option");
      expect(municipalities).toHaveLength(1);
    });
  });
});
