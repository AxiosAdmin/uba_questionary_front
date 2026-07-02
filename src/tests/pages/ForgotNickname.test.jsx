import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotNickname from "../../pages/ForgotNickname";
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

describe("ForgotNickname page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits the email and shows the API success message", async () => {
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockResolvedValue({
      message: "If the email exists, nickname recovery instructions have been generated.",
    });

    render(<ForgotNickname />);

    await userEvent.type(screen.getByLabelText("Email"), " pedro @example.com ");
    await userEvent.click(screen.getByRole("button", { name: "Send recovery link" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("forgot-nickname", {
        email: "pedro@example.com",
      });
    });
    expect(
      await screen.findByText(
        "If the email exists, nickname recovery instructions have been generated.",
      ),
    ).toBeInTheDocument();
  });

  test("shows api errors and navigates back to login", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockRejectedValue({ response: { data: { detail: "Unable to send email" } } });

    render(<ForgotNickname />);

    await userEvent.type(screen.getByLabelText("Email"), "pedro@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Send recovery link" }));

    expect(await screen.findByText("Unable to send email")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Back to login" }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
