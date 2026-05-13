import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../../Elements/Header";
import { useAppContext } from "../../helpers/ContextApi";
import { createMockAppContext } from "../utils/mockAppContext";

const mockNavigate = jest.fn();

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing for unauthenticated users", () => {
    useAppContext.mockReturnValue(createMockAppContext());

    render(<Header />);

    expect(screen.queryByRole("button", { name: "Home" })).not.toBeInTheDocument();
    expect(screen.queryByAltText("Project logo")).not.toBeInTheDocument();
  });

  test("handles navigation/logout for authenticated users", async () => {
    const logout = jest.fn();
    const setLanguage = jest.fn();
    const formatDate = jest.fn(() => "10/05/2026");
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        logout,
        setLanguage,
        formatDate,
        authUser: { nickname: "pedro" },
        questionGenerationUsage: {
          questions_used: 4,
          questions_limit: 10,
          cycle_end: "2026-05-10T12:00:00Z",
        },
      }),
    );

    render(<Header />);

    expect(screen.getByAltText("Project logo")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Home" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await waitFor(() => expect(screen.getByText("Home")).toBeInTheDocument());
    await userEvent.click(screen.getByText("Home"));
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await waitFor(() => expect(screen.getByText("My answers")).toBeInTheDocument());
    await userEvent.click(screen.getByText("My answers"));
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await waitFor(() => expect(screen.getByText("Feedback")).toBeInTheDocument());
    await userEvent.click(screen.getByText("Feedback"));
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await waitFor(() => expect(screen.getByText("Limits")).toBeInTheDocument());
    await userEvent.click(screen.getByText("Limits"));
    await waitFor(() => expect(screen.getByText("Generated this month")).toBeInTheDocument());
    expect(screen.getByText("Monthly limit")).toBeInTheDocument();
    expect(screen.getByText("Resets on")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("10/05/2026")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await waitFor(() => expect(screen.getByText("Language")).toBeInTheDocument());
    await userEvent.click(screen.getByText("Language"));
    await waitFor(() => expect(screen.getByRole("button", { name: "Portugues" })).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "Portugues" }));
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await userEvent.click(screen.getByText("Log out"));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, "/app");
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "/answered-questions");
    expect(mockNavigate).toHaveBeenNthCalledWith(3, "/feedback");
    expect(setLanguage).toHaveBeenCalledWith("pt");
    expect(logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenNthCalledWith(4, "/login");
    expect(formatDate).toHaveBeenCalledWith("2026-05-10T12:00:00Z", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  });

  test("shows unavailable values inside the limits submenu when usage metadata is incomplete", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        authUser: { nickname: "pedro" },
        questionGenerationUsage: {
          questions_used: 4,
          questions_limit: null,
          cycle_end: null,
        },
      }),
    );

    render(<Header />);

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await userEvent.click(screen.getByText("Limits"));

    expect(await screen.findByText("Generated this month")).toBeInTheDocument();
    expect(screen.getAllByText("Not available")).toHaveLength(2);
  });
});
