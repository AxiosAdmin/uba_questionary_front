import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../pages/Login";
import { useAppContext } from "../../helpers/ContextApi";
import { post } from "../../helpers/FecthApi.jsx";
import { createMockAppContext } from "../utils/mockAppContext";

const mockNavigate = jest.fn();

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("../../helpers/FecthApi.jsx", () => ({
  post: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("authenticates the user and redirects home", async () => {
    const login = jest.fn();
    useAppContext.mockReturnValue(createMockAppContext({ login }));
    post.mockResolvedValue({
      user: { id: 1, nickname: "pedro" },
      token: "token-123",
      question_generation_usage: { questions_used: 1, questions_remaining: 9 },
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(screen.getByLabelText("Password"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("login", {
        nickname: "pedro",
        password: "secret",
      });
    });
    expect(login).toHaveBeenCalledWith(
      { id: 1, nickname: "pedro" },
      "token-123",
      { questions_used: 1, questions_remaining: 9 },
    );
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("shows an error when the API response is invalid", async () => {
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockResolvedValue({});

    render(<Login />);

    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(screen.getByLabelText("Password"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Invalid response from the server.")).toBeInTheDocument();
  });

  test("supports login responses without a token", async () => {
    const login = jest.fn();
    useAppContext.mockReturnValue(createMockAppContext({ login }));
    post.mockResolvedValue({
      user: { id: 1, nickname: "pedro" },
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(screen.getByLabelText("Password"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ id: 1, nickname: "pedro" }, null, null);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("shows API errors, toggles password visibility and navigates to register", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockRejectedValue({ response: { data: { detail: "Bad credentials" } } });

    render(<Login />);

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(passwordInput, "secret");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Bad credentials")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Forgot password?" }));
    expect(mockNavigate).toHaveBeenCalledWith("/forgot-password");

    await userEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  test("shows the fallback login error when the API does not provide details", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockRejectedValue({});

    render(<Login />);

    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(screen.getByLabelText("Password"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Login failed. Check your credentials and try again.")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
