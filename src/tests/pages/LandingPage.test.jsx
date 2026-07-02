import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingPage from "../../pages/LandingPage";
import { useAppContext } from "../../helpers/ContextApi";
import { createMockAppContext } from "../utils/mockAppContext";

const mockNavigate = jest.fn();

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

describe("LandingPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the main marketing content", () => {
    useAppContext.mockReturnValue(createMockAppContext());

    render(<LandingPage />);

    expect(screen.getByText("UBA Trainer")).toBeInTheDocument();
    expect(screen.getByText("A platform to train for your UBA exams.")).toBeInTheDocument();
    expect(screen.getByText("150-question package")).toBeInTheDocument();
    expect(screen.getByText("Price: US$5")).toBeInTheDocument();
    expect(screen.getByText("AI-generated multiple-choice questions")).toBeInTheDocument();
    expect(screen.getByText("AI-generated and AI-reviewed essays (Coming soon)")).toBeInTheDocument();
    expect(screen.getByText("Mock exams (Coming soon)")).toBeInTheDocument();
    expect(
      screen.getByText("One package with 150 question generations and no expiration"),
    ).toBeInTheDocument();
    expect(screen.getByText("Subjects available in the app")).toBeInTheDocument();
    expect(screen.getByText("Histology (Coming soon)")).toBeInTheDocument();
    expect(screen.getByText("Embryology (Coming soon)")).toBeInTheDocument();
    expect(screen.getByText("Molecular biology and Genetics")).toBeInTheDocument();
  });

  test("navigates to register and login actions", async () => {
    useAppContext.mockReturnValue(createMockAppContext());

    render(<LandingPage />);

    await userEvent.click(
      screen.getByRole("button", { name: "Create account and buy package" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "I already have an account" }));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, "/register");
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "/login");
  });
});
