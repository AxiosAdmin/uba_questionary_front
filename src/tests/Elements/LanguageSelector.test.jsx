import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSelector from "../../Elements/LanguageSelector";
import { useAppContext } from "../../helpers/ContextApi";
import { createMockAppContext } from "../utils/mockAppContext";

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

describe("LanguageSelector", () => {
  test("renders the default selector classes, available languages, and updates the selected language", async () => {
    const setLanguage = jest.fn();
    useAppContext.mockReturnValue(
      createMockAppContext({
        language: "es",
        setLanguage,
      }),
    );

    render(<LanguageSelector />);

    const select = screen.getByLabelText("Idioma");
    const wrapper = select.closest("div");

    expect(select).toHaveValue("es");
    expect(select).toHaveClass("language-selector-input");
    expect(select).not.toHaveClass("language-selector-input-embedded");
    expect(wrapper).toHaveClass("language-selector-shell");
    expect(wrapper).not.toHaveClass("language-selector-shell-embedded");
    expect(screen.getByRole("option", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Español" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Portugués" })).toBeInTheDocument();

    await userEvent.selectOptions(select, "pt");

    expect(setLanguage).toHaveBeenCalledWith("pt");
  });

  test("renders embedded classes and updates the selected language in embedded mode", async () => {
    const setLanguage = jest.fn();
    useAppContext.mockReturnValue(
      createMockAppContext({
        language: "pt",
        setLanguage,
      }),
    );

    render(<LanguageSelector embedded />);

    const select = screen.getByLabelText("Idioma");
    const wrapper = select.closest("div");

    expect(select).toHaveValue("pt");
    expect(select).toHaveClass("language-selector-input");
    expect(select).toHaveClass("language-selector-input-embedded");
    expect(wrapper).toHaveClass("language-selector-shell");
    expect(wrapper).toHaveClass("language-selector-shell-embedded");

    await userEvent.selectOptions(select, "en");

    expect(setLanguage).toHaveBeenCalledWith("en");
  });
});
