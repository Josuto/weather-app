import {render, screen} from "@testing-library/react";
import {MunicipalityCard} from "./MunicipalityCard";
import {municipalityFixture} from "../types/Municipality";
import userEvent from "@testing-library/user-event";
import {get, remove} from "../util/BrowserStorage";
import {
  municipalityPayloadFixture,
  MunicipalityWithWeatherData,
} from "../types/MunicipalityWithWeatherData";
import theme from "../styles/theme";
import {ThemeProvider} from "@mui/material";

const mockMunicipalityPayload = jest.fn();

jest.mock("../hooks/UseFetchMunicipalityWithWeatherData", () => ({
  useFetchMunicipalityWithWeatherData: () => mockMunicipalityPayload(),
}));

async function addMunicipalityToFavorites(): Promise<void> {
  const saveButton = screen.getByRole("button", {name: "Save"});
  userEvent.click(saveButton);
}

async function removeMunicipalityFromFavorites(): Promise<void> {
  const removeButton = await screen.findByRole("button", {name: "Remove"});
  userEvent.click(removeButton);
}

function closeMunicipalityCard(): void {
  const municipalityCardCloseButton = screen.getByRole("button", {
    name: "Close",
  });
  userEvent.click(municipalityCardCloseButton);
}

describe("Given a municipality card", () => {
  const municipality = municipalityFixture();

  afterEach(() => {
    mockMunicipalityPayload.mockReset();
  });

  describe("when the municipality weather data cannot be loaded due to e.g., a network error", () => {
    it("should display a loading error warning as the card content", () => {
      mockMunicipalityPayload.mockReturnValue({
        data: municipality,
        error: new Error(),
      });

      render(
        <ThemeProvider theme={theme}>
          <MunicipalityCard municipality={municipality} onClose={() => {}} />
        </ThemeProvider>
      );

      const errorWarning = screen.getByText("Loading error");
      expect(errorWarning).toBeInTheDocument();
    });
  });

  describe("when the municipality weather data has not yet been loaded", () => {
    it("should display a spinner as the card content", () => {
      mockMunicipalityPayload.mockReturnValue({
        data: municipality,
        error: undefined,
      });

      render(
        <ThemeProvider theme={theme}>
          <MunicipalityCard municipality={municipality} onClose={() => {}} />
        </ThemeProvider>
      );

      const spinner = screen.getByRole("progressbar");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("when the municipality weather data has been loaded", () => {
    it("should display the weather data as the card content", () => {
      const {data} = municipalityPayloadFixture();

      mockMunicipalityPayload.mockReturnValue({
        data: data,
        error: undefined,
      });

      render(
        <ThemeProvider theme={theme}>
          <MunicipalityCard municipality={municipality} onClose={() => {}} />
        </ThemeProvider>
      );

      const municipalityWithWeatherData = data as MunicipalityWithWeatherData;
      const humidityValue = screen.getByText(
        municipalityWithWeatherData.weatherData!.humidity! + "%"
      );
      const windValue = screen.getByText(
        municipalityWithWeatherData.weatherData!.wind! + " km/h"
      );
      const rainProbabilityValue = screen.getByText(
        municipalityWithWeatherData.weatherData!.rainProbability! + "%"
      );
      const currentTemperatureValue = screen.getByText(
        municipalityWithWeatherData.weatherData!.temperature!.actual + "°"
      );
      const maxTemperatureValue = screen.getByText(
        municipalityWithWeatherData.weatherData!.temperature!.max + "°"
      );
      const minTemperatureValue = screen.getByText(
        municipalityWithWeatherData.weatherData!.temperature!.min + "°"
      );
      expect(humidityValue).toBeInTheDocument();
      expect(windValue).toBeInTheDocument();
      expect(rainProbabilityValue).toBeInTheDocument();
      expect(currentTemperatureValue).toBeInTheDocument();
      expect(maxTemperatureValue).toBeInTheDocument();
      expect(minTemperatureValue).toBeInTheDocument();
    });
  });

  describe("when the user clicks on the save card button", () => {
    beforeEach(() => {
      mockMunicipalityPayload.mockReturnValue({
        data: municipality,
        error: undefined,
      });
    });

    afterEach(() => {
      remove(municipality.id);
    });

    it("should change the button to a remove card button and save the municipality from the local storage", async () => {
      render(
        <ThemeProvider theme={theme}>
          <MunicipalityCard municipality={municipality} onClose={() => {}} />
        </ThemeProvider>
      );

      await addMunicipalityToFavorites();

      const removeButton = await screen.findByRole("button", {name: "Remove"});
      expect(removeButton).toBeInTheDocument();

      const saveButton = screen.queryByRole("button", {name: "Save"});
      expect(saveButton).not.toBeInTheDocument();

      expect(get(municipality.id)).toEqual(municipality);
    });

    describe("and then the user clicks on the remove card button", () => {
      it("should change the button back to a save card button and delete the municipality from the local storage", async () => {
        render(
          <ThemeProvider theme={theme}>
            <MunicipalityCard municipality={municipality} onClose={() => {}} />
          </ThemeProvider>
        );

        await addMunicipalityToFavorites();
        await removeMunicipalityFromFavorites();

        const saveButton = await screen.findByRole("button", {name: "Save"});
        expect(saveButton).toBeInTheDocument();

        const removeButton = screen.queryByRole("button", {name: "Remove"});
        expect(removeButton).not.toBeInTheDocument();

        expect(get(municipality.id)).toBeNull();
      });
    });

    describe("and then the user clicks on the close button", () => {
      it("should delete the municipality from the local storage", async () => {
        render(
          <ThemeProvider theme={theme}>
            <MunicipalityCard municipality={municipality} onClose={() => {}} />
          </ThemeProvider>
        );

        await addMunicipalityToFavorites();
        closeMunicipalityCard();

        expect(get(municipality.id)).toBeNull();
      });
    });
  });
});
