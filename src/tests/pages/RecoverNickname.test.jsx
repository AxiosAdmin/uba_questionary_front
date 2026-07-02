import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecoverNickname from "../../pages/RecoverNickname";
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

describe("RecoverNickname page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.get.mockImplementation((key) =>
      key === "token" ? "recovery-token" : null,
    );
  });

  test("submits the token from the url and updates the nickname", async () => {
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockResolvedValue({
      message: "Nickname updated successfully.",
      nickname: "nuevo_pedrov",
    });

    render(<RecoverNickname />);

    await userEvent.type(
      screen.getByLabelText("New nickname"),
      " nuevo_pedrov ",
    );
    await userEvent.click(screen.getByRole("button", { name: "Update my nickname" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("recover-nickname", {
        token: "recovery-token",
        new_nickname: "nuevo_pedrov",
      });
    });
    expect(await screen.findByText("Nickname updated successfully.")).toBeInTheDocument();
    expect(await screen.findByText(/Updated nickname:/)).toBeInTheDocument();
    expect(await screen.findByText(/nuevo_pedrov/)).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith("/recover-nickname", { replace: true });
  });

  test("shows an invalid token state when the url does not provide a token", async () => {
    useAppContext.mockReturnValue(createMockAppContext());
    mockSearchParams.get.mockReturnValue(null);

    render(<RecoverNickname />);

    expect(
      screen.getByText("Use the recovery link to choose a new nickname for your account."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Back to login" }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("keeps the invalid token error when the form is submitted without a token", async () => {
    useAppContext.mockReturnValue(createMockAppContext());
    mockSearchParams.get.mockReturnValue(null);

    render(<RecoverNickname />);

    fireEvent.submit(screen.getByRole("button", { name: "Back to login" }).closest("form"));

    expect(
      await screen.findByText(
        "The nickname recovery link is invalid or has already expired.",
      ),
    ).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  test("requires a new nickname before submitting", async () => {
    useAppContext.mockReturnValue(createMockAppContext());

    render(<RecoverNickname />);

    expect(
      screen.getByRole("button", { name: "Update my nickname" }),
    ).toBeDisabled();
    expect(post).not.toHaveBeenCalled();
  });

  test("shows api errors", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(createMockAppContext());
    post.mockRejectedValue({ response: { data: { detail: "Invalid nickname recovery token" } } });

    render(<RecoverNickname />);
    await userEvent.type(
      screen.getByLabelText("New nickname"),
      "nuevo_pedrov",
    );

    await userEvent.click(screen.getByRole("button", { name: "Update my nickname" }));

    expect(await screen.findByText("Invalid nickname recovery token")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
