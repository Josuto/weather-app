import {render, screen} from "@testing-library/react";
import {MunicipalityCard} from "./MunicipalityCard";
import {municipalityFixture} from "../types/Municipality";
import userEvent from "@testing-library/user-event";
import {get, remove} from "../util/BrowserStorage";

async function clickOnSaveCardButton(): Promise<void> {
  const saveButton = screen.getByRole("button", {name: "Save"});
  userEvent.click(saveButton);
}

async function clickOnDiscardCardButton(): Promise<void> {
  const discardButton = await screen.findByRole("button", {name: "Discard"});
  userEvent.click(discardButton);
}

function closeMunicipalityCard(): void {
  const municipalityCardCloseButton = screen.getByRole("button", {
    name: "Close",
  });
  userEvent.click(municipalityCardCloseButton);
}

describe("Given a municipality card", () => {
  const municipality = municipalityFixture();

  it("should include a save card button", () => {
    render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

    const saveButton = screen.getByRole("button", {name: "Save"});
    expect(saveButton).toBeInTheDocument();
  });

  describe("when the user clicks on the save card button", () => {
    afterEach(() => {
      remove(municipality.id);
    });

    it("should change the button to a discard card button and save the municipality from the local storage", async () => {
      render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

      await clickOnSaveCardButton();

      const discardButton = await screen.findByRole("button", {name: "Discard"});
      expect(discardButton).toBeInTheDocument();
      const saveButton = screen.queryByRole("button", {name: "Save"});
      expect(saveButton).not.toBeInTheDocument();

      expect(get(municipality.id)).toEqual(municipality);
    });

    describe("and the user clicks on the discard button", () => {
      it("should change the button back to a save card button and delete the municipality from the local storage", async () => {
        render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

        await clickOnSaveCardButton();
        await clickOnDiscardCardButton();

        const saveButton = await screen.findByRole("button", {name: "Save"});
        expect(saveButton).toBeInTheDocument();

        const discardButton = screen.queryByRole("button", {name: "Discard"});
        expect(discardButton).not.toBeInTheDocument();

        expect(get(municipality.id)).toBeNull();
      });
    });

    describe("and the user clicks on the close button", () => {
      it("should delete the municipality from the local storage", async () => {
        render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

        await clickOnSaveCardButton();
        closeMunicipalityCard();

        expect(get(municipality.id)).toBeNull();
      });
    });
  });
});
