import { render, screen } from "@testing-library/react";
import Footer from "../../Elements/Footer";
import { useAppContext } from "../../helpers/ContextApi";
import { createMockAppContext } from "../utils/mockAppContext";

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

describe("Footer", () => {
  test("renders the translated footer text and support contact", () => {
    useAppContext.mockReturnValue(createMockAppContext());

    render(<Footer />);

    expect(screen.getByText("Developed by Pedro Vieira")).toBeInTheDocument();
    expect(screen.getByText("Contact:")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "soporte@axiosacademia.com" }),
    ).toHaveAttribute("href", "mailto:soporte@axiosacademia.com");
    expect(
      screen.getByRole("link", { name: "Instagram Axios Academy" }),
    ).toHaveAttribute("href", "https://www.instagram.com/axios.academy/");
  });
});
