import {render, screen} from "@testing-library/react";
import {MunicipalitySearch} from "./MunicipalitySearch";
import userEvent from "@testing-library/user-event";

describe("Given the municipality search bar component", () => {
  describe("when the user selects a municipality", () => {
    it.skip("should exclude the municipality from the eligible municipalities", async () => {
      render(<MunicipalitySearch onChange={() => {}} />);

      const municipalitySearchBeforeSelect = screen.getByRole("combobox");
      userEvent.click(municipalitySearchBeforeSelect);
      const [municipalityOption] = await screen.findAllByRole("option");
      userEvent.click(municipalityOption);

      const municipalitySearchAfterSelect = await screen.findByRole("combobox");
      screen.debug(municipalitySearchAfterSelect);
    });
  });
});
