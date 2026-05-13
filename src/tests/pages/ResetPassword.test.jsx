import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPassword from "../../pages/ResetPassword";
import { useAppContext } from "../../helpers/ContextApi";
import { post } from "../../helpers/FecthApi.jsx";
import { createMockAppContext } from "../utils/mockAppContext";

const mockNavigate = jest.fn();
const mockSearchParams = {
  get: jest.fn(),
};

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("../../helpers/FecthApi.jsx", () => ({
  post: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}), { virtual: true });

describe("ResetPassword page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.get.mockImplementation((key) =>
      key === "token" ? "reset-token" : null,
    );
  });

  test("submits the token from the url and shows the success message", async () => {
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockResolvedValue({ message: "Password updated successfully." });

    render(<ResetPassword />);

    await userEvent.type(screen.getByLabelText("New password"), "NovaSenha123!");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "NovaSenha123!");
    await userEvent.click(screen.getByRole("button", { name: "Update password" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("reset-password", {
        token: "reset-token",
        new_password: "NovaSenha123!",
      });
    });
    expect(await screen.findByText("Password updated successfully.")).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith("/reset-password", { replace: true });
  });

  test("validates mismatched passwords before sending the request", async () => {
    useAppContext.mockReturnValue(createMockAppContext());

    render(<ResetPassword />);

    await userEvent.type(screen.getByLabelText("New password"), "NovaSenha123!");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "OutraSenha123!");
    await userEvent.click(screen.getByRole("button", { name: "Update password" }));

    expect(await screen.findByText("The passwords do not match.")).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  test("shows an invalid token state when the url does not provide a token", async () => {
    useAppContext.mockReturnValue(createMockAppContext());
    mockSearchParams.get.mockReturnValue(null);

    render(<ResetPassword />);

    expect(
      screen.getByText("Choose a new password to finish recovering your account."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Back to login" }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("keeps the invalid token error when the form is submitted without a token", async () => {
    useAppContext.mockReturnValue(createMockAppContext());
    mockSearchParams.get.mockReturnValue(null);

    render(<ResetPassword />);

    fireEvent.submit(screen.getByLabelText("New password").closest("form"));

    expect(
      await screen.findByText(
        "The password reset link is invalid or has already been used.",
      ),
    ).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  test("blocks weak passwords before sending the request", async () => {
    useAppContext.mockReturnValue(createMockAppContext());

    render(<ResetPassword />);

    await userEvent.type(screen.getByLabelText("New password"), "secret");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Update password" }));

    expect(
      await screen.findAllByText(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.",
      ),
    ).not.toHaveLength(0);
    expect(post).not.toHaveBeenCalled();
  });

  test("blocks a weak confirmation password before sending the request", async () => {
    useAppContext.mockReturnValue(createMockAppContext());

    render(<ResetPassword />);

    await userEvent.type(screen.getByLabelText("New password"), "NovaSenha123!");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Update password" }));

    expect(
      await screen.findAllByText(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.",
      ),
    ).not.toHaveLength(0);
    expect(post).not.toHaveBeenCalled();
  });

  test("shows api errors and toggles password visibility", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockRejectedValue({ response: { data: { detail: "Invalid password reset token" } } });

    render(<ResetPassword />);

    const newPasswordInput = screen.getByLabelText("New password");
    expect(newPasswordInput).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(newPasswordInput).toHaveAttribute("type", "text");

    await userEvent.type(newPasswordInput, "NovaSenha123!");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "NovaSenha123!");
    await userEvent.click(screen.getByRole("button", { name: "Update password" }));

    expect(await screen.findByText("Invalid password reset token")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
