import {render, screen} from "@testing-library/react";
import {MunicipalityCard} from "./MunicipalityCard";
import {municipalityFixture} from "../types/Municipality";
import userEvent from "@testing-library/user-event";
import {get, remove} from "../util/BrowserStorage";

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

  it("should include a save card button", () => {
    render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

    const saveButton = screen.getByRole("button", {name: "Save"});
    expect(saveButton).toBeInTheDocument();
  });

  describe("when the user clicks on the save card button", () => {
    afterEach(() => {
      remove(municipality.id);
    });

    it("should change the button to a remove card button and save the municipality from the local storage", async () => {
      render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

      await addMunicipalityToFavorites();

      const removeButton = await screen.findByRole("button", {name: "Remove"});
      expect(removeButton).toBeInTheDocument();

      const saveButton = screen.queryByRole("button", {name: "Save"});
      expect(saveButton).not.toBeInTheDocument();

      expect(get(municipality.id)).toEqual(municipality);
    });

    describe("and the user clicks on the remove card button", () => {
      it("should change the button back to a save card button and delete the municipality from the local storage", async () => {
        render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

        await addMunicipalityToFavorites();
        await removeMunicipalityFromFavorites();

        const saveButton = await screen.findByRole("button", {name: "Save"});
        expect(saveButton).toBeInTheDocument();

        const removeButton = screen.queryByRole("button", {name: "Remove"});
        expect(removeButton).not.toBeInTheDocument();

        expect(get(municipality.id)).toBeNull();
      });
    });

    describe("and the user clicks on the close button", () => {
      it("should delete the municipality from the local storage", async () => {
        render(<MunicipalityCard municipality={municipality} onClose={() => {}} />);

        await addMunicipalityToFavorites();
        closeMunicipalityCard();

        expect(get(municipality.id)).toBeNull();
      });
    });
  });
});
