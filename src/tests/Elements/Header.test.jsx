import { render, screen } from "@testing-library/react";
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

  test("renders usage info and handles navigation/logout for authenticated users", async () => {
    const logout = jest.fn();
    const formatDate = jest.fn(() => "10/05/2026");
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        logout,
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
    expect(screen.getByText("Questions this month")).toBeInTheDocument();
    expect(screen.getByText("4 / 10")).toBeInTheDocument();
    expect(screen.getByTitle("Your monthly limit will reset on 10/05/2026.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    await userEvent.click(screen.getByRole("button", { name: "My answers" }));
    await userEvent.click(screen.getByRole("button", { name: "Feedback" }));
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, "/app");
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "/answered-questions");
    expect(mockNavigate).toHaveBeenNthCalledWith(3, "/feedback");
    expect(logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenNthCalledWith(4, "/login");
    expect(formatDate).toHaveBeenCalledWith("2026-05-10T12:00:00Z", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  });

  test("hides usage info for admin users", () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        authUser: { global_role: "Admin" },
      }),
    );

    render(<Header />);

    expect(screen.queryByText("Questions this month")).not.toBeInTheDocument();
  });

  test("shows usage without a limit when no cycle end is available", () => {
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

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.queryByText("4 / 10")).not.toBeInTheDocument();
    expect(screen.getByTitle("The monthly reset date is not available yet.")).toBeInTheDocument();
  });
});
