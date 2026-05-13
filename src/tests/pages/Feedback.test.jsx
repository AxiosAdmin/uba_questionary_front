import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Feedback from "../../pages/Feedback";
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

describe("Feedback page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits feedback for the authenticated user", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        getCurrentUserId: () => "user-123",
      }),
    );
    post.mockResolvedValue({ data: { id: "feedback-1" } });

    render(<Feedback />);

    await userEvent.type(
      screen.getByLabelText("Your feedback"),
      "It would be great to have a study streak counter.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("user-feedback", {
        user_id: "user-123",
        text_feedback: "It would be great to have a study streak counter.",
      });
    });
    expect(await screen.findByText("Thanks! Your feedback has been sent.")).toBeInTheDocument();
  });

  test("shows an error when the authenticated user cannot be identified", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        getCurrentUserId: () => null,
      }),
    );

    render(<Feedback />);

    await userEvent.type(screen.getByLabelText("Your feedback"), "Suggestion");
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));

    expect(
      await screen.findByText("Unable to identify the authenticated user."),
    ).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  test("shows API errors and allows navigating back home", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    useAppContext.mockReturnValue(
      createMockAppContext({
        getCurrentUserId: () => "user-123",
      }),
    );
    post.mockRejectedValue({ response: { data: { detail: "Feedback service offline" } } });

    render(<Feedback />);

    await userEvent.type(screen.getByLabelText("Your feedback"), "Suggestion");
    await userEvent.click(screen.getByRole("button", { name: "Send feedback" }));

    expect(await screen.findByText("Feedback service offline")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Back to home" }));
    expect(mockNavigate).toHaveBeenCalledWith("/app");
  });
});
