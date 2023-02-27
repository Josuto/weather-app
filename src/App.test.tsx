import {render, screen} from "@testing-library/react";
import App from "./App";
import {Municipality} from "./types/Municipality";
import userEvent from "@testing-library/user-event";
import {MunicipalityWithWeatherDataOrError} from "./types/MunicipalityWithWeatherData";

const mockMunicipalities: Municipality[] = [
  {
    id: "00001",
    name: "Some municipality",
    provinceId: "01",
    provinceName: "Some province",
  },
];

const mockMunicipalityWithWeatherData: MunicipalityWithWeatherDataOrError = {
  data: {
    temperature: {
      actual: "5",
      max: "10",
      min: "2",
    },
    ...mockMunicipalities[0],
  },
  error: undefined,
};

jest.mock("./hooks/UseFetchMunicipalities", () => ({
  useFetchMunicipalities: () => mockMunicipalities,
}));

jest.mock("./hooks/UseFetchMunicipalityWithWeatherData", () => ({
  useFetchMunicipalityWithWeatherData: () => mockMunicipalityWithWeatherData,
}));

async function selectMunicipalityFromSearchBar(): Promise<void> {
  const municipalitySearch = screen.getByRole("combobox");
  userEvent.click(municipalitySearch);
  const [municipalityOption] = await screen.findAllByRole("option");
  userEvent.click(municipalityOption);
}

describe("Given the weather app", () => {
  it("should include its basic components", async () => {
    render(<App />);

    const municipalitySearch = screen.getByRole("combobox");
    expect(municipalitySearch).toBeInTheDocument();

    const municipalityCards = screen.queryAllByText("Some municipality");
    expect(municipalityCards).toHaveLength(0);
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
