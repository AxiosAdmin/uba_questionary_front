import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profile from "../../pages/Profile";
import { useAppContext } from "../../helpers/ContextApi";
import { get, put } from "../../helpers/FecthApi.jsx";
import { createMockAppContext } from "../utils/mockAppContext";

const mockNavigate = jest.fn();

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("../../helpers/FecthApi.jsx", () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

describe("Profile page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads the authenticated user profile and allows updating the registration data", async () => {
    const updateAuthUserProfile = jest.fn();
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        requiresCbuUpdate: true,
        updateAuthUserProfile,
      }),
    );
    get.mockResolvedValue({
      data: {
        name: "Pedro Vieira",
        email: "pedro@example.com",
        nickname: "pedrov",
        cbu: "0000000000000000000000",
      },
    });
    put.mockResolvedValue({
      data: {
        name: "Pedro Vieira",
        email: "pedro@example.com",
        nickname: "pedrov",
        cbu: "0070010800000001234565",
      },
    });

    render(<Profile />);

    expect(await screen.findByText("Profile")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your account still needs a valid CBU. Update your data below to complete your registration.",
      ),
    ).toBeInTheDocument();

    const cbuInput = await screen.findByLabelText("CBU");
    expect(cbuInput).toHaveValue("0000000000000000000000");

    await userEvent.clear(cbuInput);
    await userEvent.type(cbuInput, "0070010800000001234565");
    await userEvent.click(screen.getByRole("button", { name: "Update profile" }));

    await waitFor(() => {
      expect(put).toHaveBeenCalledWith("users/me", {
        name: "Pedro Vieira",
        email: "pedro@example.com",
        nickname: "pedrov",
        cbu: "0070010800000001234565",
      });
    });
    expect(updateAuthUserProfile).toHaveBeenCalledWith({
      name: "Pedro Vieira",
      email: "pedro@example.com",
      nickname: "pedrov",
      cbu: "0070010800000001234565",
    });
    expect(await screen.findByText("Profile updated successfully.")).toBeInTheDocument();
  });

  test("shows a load error when the request fails", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
      }),
    );
    get.mockRejectedValue({ response: { data: { detail: "Load failed" } } });

    render(<Profile />);

    expect(await screen.findByText("Load failed")).toBeInTheDocument();
  });

  test("shows an update error and allows navigating back home", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
      }),
    );
    get.mockResolvedValue({
      data: {
        name: "Pedro Vieira",
        email: "pedro@example.com",
        nickname: "pedrov",
        cbu: "0070010800000001234565",
      },
    });
    put.mockRejectedValue({ response: { data: { detail: "Email already exists" } } });

    render(<Profile />);

    await screen.findByDisplayValue("Pedro Vieira");
    await userEvent.click(screen.getByRole("button", { name: "Update profile" }));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Back to home" }));
    expect(mockNavigate).toHaveBeenCalledWith("/app");
  });

  test("keeps the cbu field locked for users who already have a valid cbu", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        requiresCbuUpdate: false,
      }),
    );
    get.mockResolvedValue({
      data: {
        name: "Pedro Vieira",
        email: "pedro@example.com",
        nickname: "pedrov",
        cbu: "0070010800000001234565",
      },
    });

    render(<Profile />);

    const cbuInput = await screen.findByLabelText("CBU");
    expect(cbuInput).toBeDisabled();
    expect(
      screen.getByText("Your CBU is already registered and cannot be changed here."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Your account still needs a valid CBU. Update your data below to complete your registration.",
      ),
    ).not.toBeInTheDocument();
  });
});
