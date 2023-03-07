import {render, screen} from "@testing-library/react";
import {MunicipalityCard} from "./MunicipalityCard";
import {municipalityFixture} from "../types/Municipality";
import userEvent from "@testing-library/user-event";

async function clickOnSaveCardButton(): Promise<void> {
  const saveButton = screen.getByRole("button", {name: "Save"});
  userEvent.click(saveButton);
}

async function clickOnDiscardCardButton(): Promise<void> {
  const discardButton = await screen.findByRole("button", {name: "Discard"});
  userEvent.click(discardButton);
}

describe("Given a municipality card", () => {
  it("should include a save card button", () => {
    render(<MunicipalityCard municipality={municipalityFixture()} onClose={() => {}} />);

    const saveButton = screen.getByRole("button", {name: "Save"});
    expect(saveButton).toBeInTheDocument();
  });

  describe("when the user clicks on the save card button", () => {
    it("should change the button to a discard card button and save the municipality identifiers from the local storage", async () => {
      const municipality = municipalityFixture();
      render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

      await clickOnSaveCardButton();

      const discardButton = await screen.findByRole("button", {name: "Discard"});
      expect(discardButton).toBeInTheDocument();
      const saveButton = screen.queryByRole("button", {name: "Save"});
      expect(saveButton).not.toBeInTheDocument();

      const expectedMunicipalityIdentifiers = JSON.stringify(municipality);
      expect(localStorage.getItem(municipality.id)).toStrictEqual(
        expectedMunicipalityIdentifiers
      );
    });

    describe("and the user clicks on the discard button", () => {
      it("should change the button back to a save card button and delete the municipality identifiers from the local storage", async () => {
        const municipality = municipalityFixture();
        render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

        await clickOnSaveCardButton();
        await clickOnDiscardCardButton();

        const saveButton = await screen.findByRole("button", {name: "Save"});
        expect(saveButton).toBeInTheDocument();

        const discardButton = screen.queryByRole("button", {name: "Discard"});
        expect(discardButton).not.toBeInTheDocument();

        expect(localStorage.getItem(municipality.id)).toBeNull();
      });
    });
  });
});
