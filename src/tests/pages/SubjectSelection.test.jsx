import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SubjectSelection from "../../pages/SubjectSelection";
import { useAppContext } from "../../helpers/ContextApi";
import { get, post } from "../../helpers/FecthApi.jsx";
import { createMockAppContext } from "../utils/mockAppContext";

const mockNavigate = jest.fn();
const originalLocation = window.location;

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("../../helpers/FecthApi.jsx", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

describe("SubjectSelection page", () => {
  beforeAll(() => {
    delete window.location;
    window.location = { href: "" };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = "";
  });

  test("navigates to the selected subject and to the answers history when access is active", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        hasSubscriptionAccess: true,
        hasQuestionPackageAvailable: true,
        selectedInstitution: { id: 1, name: "UBA" },
        hasSelectedInstitution: true,
      }),
    );

    render(<SubjectSelection />);

    await userEvent.click(screen.getByText("Anatomy"));
    await userEvent.click(screen.getByRole("button", { name: "View my answers" }));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, "/anatomy");
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "/answered-questions");
  });

  test("navigates to the biology route when the biology subject is selected", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        hasSubscriptionAccess: true,
        hasQuestionPackageAvailable: true,
        selectedInstitution: { id: 1, name: "UBA" },
        hasSelectedInstitution: true,
      }),
    );

    render(<SubjectSelection />);

    await userEvent.click(screen.getByText("Molecular biology and Genetics"));

    expect(mockNavigate).toHaveBeenCalledWith("/biology");
  });

  test("shows an error when the checkout is requested without an authenticated user id", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: { id: 1, name: "UBA" },
        getCurrentUserId: () => null,
      }),
    );

    render(<SubjectSelection />);

    expect(screen.getByText("Price: US$5")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Buy package now" }));

    expect(screen.getByText("Unable to identify the authenticated user.")).toBeInTheDocument();
  });

  test("shows an informational message when access refresh reports a pending payment", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: { id: 1, name: "UBA" },
        refreshSubscriptionAccess: jest.fn().mockResolvedValue(false),
      }),
    );

    render(<SubjectSelection />);

    await userEvent.click(screen.getByRole("button", { name: "I already paid, refresh access" }));

    expect(await screen.findByText(
      "Payment is still processing or your package has not been released yet.",
    )).toBeInTheDocument();
  });

  test("does not show the pending message when access refresh succeeds", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: { id: 1, name: "UBA" },
        refreshSubscriptionAccess: jest.fn().mockResolvedValue(true),
      }),
    );

    render(<SubjectSelection />);

    await userEvent.click(screen.getByRole("button", { name: "I already paid, refresh access" }));

    await waitFor(() => {
      expect(screen.queryByText(
        "Payment is still processing or your package has not been released yet.",
      )).not.toBeInTheDocument();
    });
  });

  test("logs out and redirects to checkout when the session is generated successfully", async () => {
    const logout = jest.fn();
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: { id: 1, name: "UBA" },
        getCurrentUserId: () => 99,
        logout,
      }),
    );
    post.mockResolvedValue({ url_session: "https://checkout.example.com/1" });

    render(<SubjectSelection />);

    await userEvent.click(screen.getByRole("button", { name: "Buy package now" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("stripe/generate", { user_id: 99 });
    });
    expect(logout).toHaveBeenCalled();
    expect(window.location.href).toBe("https://checkout.example.com/1");
  });

  test("shows the repurchase state and logs out before redirecting when the package is exhausted", async () => {
    const logout = jest.fn();
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        hasSubscriptionAccess: true,
        hasQuestionPackageAvailable: false,
        selectedInstitution: { id: 1, name: "UBA" },
        getCurrentUserId: () => 99,
        logout,
      }),
    );
    post.mockResolvedValue({ url_session: "https://checkout.example.com/2" });

    render(<SubjectSelection />);

    expect(
      screen.getByText("Buy a new package to keep generating questions"),
    ).toBeInTheDocument();
    expect(screen.getByText("Price: US$5")).toBeInTheDocument();
    expect(screen.queryByText("Choose your subject")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Buy another package" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("stripe/generate", { user_id: 99 });
    });
    expect(logout).toHaveBeenCalled();
    expect(window.location.href).toBe("https://checkout.example.com/2");
  });

  test("shows checkout and refresh errors", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: { id: 1, name: "UBA" },
        getCurrentUserId: () => 99,
        refreshSubscriptionAccess: jest
          .fn()
          .mockRejectedValue({ response: { data: { detail: "Refresh failed" } } }),
      }),
    );
    post.mockResolvedValue({});

    render(<SubjectSelection />);

    await userEvent.click(screen.getByRole("button", { name: "Buy package now" }));
    expect(await screen.findByText("Unable to start the package checkout.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "I already paid, refresh access" }));
    expect(await screen.findByText("Refresh failed")).toBeInTheDocument();
  });

  test("shows the fallback checkout error when the request throws without a detail message", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: { id: 1, name: "UBA" },
        getCurrentUserId: () => 99,
      }),
    );
    post.mockRejectedValue({});

    render(<SubjectSelection />);

    await userEvent.click(screen.getByRole("button", { name: "Buy package now" }));

    expect(await screen.findByText("Unable to start the package checkout.")).toBeInTheDocument();
  });

  test("loads and stores the default institution when one is not selected yet", async () => {
    const setSelectedInstitution = jest.fn();
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: null,
        setSelectedInstitution,
      }),
    );
    get.mockResolvedValue({ data: [{ id: 1, name: "UBA" }] });

    render(<SubjectSelection />);

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith("institutions");
    });
    expect(setSelectedInstitution).toHaveBeenCalledWith({ id: 1, name: "UBA" });
  });

  test("does not store an institution when the default one is not returned by the API", async () => {
    const setSelectedInstitution = jest.fn();
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: null,
        setSelectedInstitution,
      }),
    );
    get.mockResolvedValue({ data: [{ id: 2, name: "Other" }] });

    render(<SubjectSelection />);

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith("institutions");
    });
    expect(setSelectedInstitution).not.toHaveBeenCalled();
  });

  test("skips institution loading when one is already selected and shows account fallback text", () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: { id: 1, name: "UBA" },
        authUser: {},
      }),
    );

    render(<SubjectSelection />);

    expect(get).not.toHaveBeenCalled();
    expect(screen.getByText("Active account")).toBeInTheDocument();
  });

  test("shows a dni update warning when the logged user is using the migration placeholder", () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        hasSubscriptionAccess: true,
        hasQuestionPackageAvailable: true,
        requiresDniUpdate: true,
        selectedInstitution: { id: 1, name: "UBA" },
      }),
    );

    render(<SubjectSelection />);

    expect(
      screen.getByText(
        "Your account needs a DNI update before your registration is fully up to date. Open Profile to finish your registration.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open Profile" })).toBeInTheDocument();
  });

  test("blocks checkout in the frontend when the user still has the placeholder dni", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        requiresDniUpdate: true,
        selectedInstitution: { id: 1, name: "UBA" },
        getCurrentUserId: () => 99,
      }),
    );

    render(<SubjectSelection />);

    const buyButton = screen.getByRole("button", { name: "Buy package now" });
    expect(buyButton).toBeDisabled();
    expect(post).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Open Profile" }));
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  test("shows the fallback refresh error when the request has no detail message", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        hasSubscriptionAccess: false,
        selectedInstitution: { id: 1, name: "UBA" },
        refreshSubscriptionAccess: jest.fn().mockRejectedValue({}),
      }),
    );

    render(<SubjectSelection />);

    await userEvent.click(screen.getByRole("button", { name: "I already paid, refresh access" }));

    expect(await screen.findByText("Unable to verify the package access status.")).toBeInTheDocument();
  });
});
