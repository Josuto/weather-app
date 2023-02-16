import React from "react";
import {render, screen} from "@testing-library/react";
import App from "./App";
import {Municipality} from "./types/Municipality";
import userEvent from "@testing-library/user-event";

const municipalities: Municipality[] = [
  {
    name: "Some municipality",
    provinceName: "Some province",
    provinceId: "01",
    municipalityId: "00001",
  },
];

jest.mock("./hooks/useFetchMunicipalities", () => ({
  useFetchMunicipalities: () => municipalities,
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
