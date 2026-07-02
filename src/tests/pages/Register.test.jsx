import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "../../pages/Register";
import { useAppContext } from "../../helpers/ContextApi";
import { post } from "../../helpers/FecthApi.jsx";
import { createMockAppContext } from "../utils/mockAppContext";

const mockNavigate = jest.fn();
const originalLocation = window.location;

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("../../helpers/FecthApi.jsx", () => ({
  post: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

describe("Register page", () => {
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
    useAppContext.mockReturnValue(createMockAppContext());
  });

  test("creates the account and redirects to checkout", async () => {
    post
      .mockResolvedValueOnce({ data: { id: 99, stripe_customer_id: "cus_123" } })
      .mockResolvedValueOnce({ url_session: "https://checkout.example.com/session" });

    render(<Register />);

    await userEvent.type(screen.getByLabelText("Name"), "Pedro");
    await userEvent.type(screen.getByLabelText("Email"), " pedro @example.com ");
    await userEvent.type(screen.getByLabelText("Nickname"), " pe dro ");
    await userEvent.type(screen.getByLabelText("DNI"), " 12 345 678 ");
    await userEvent.type(screen.getByLabelText("Password"), " Secret 123! ");
    await userEvent.click(screen.getByRole("button", { name: "Register and buy package" }));

    await waitFor(() => {
      expect(post).toHaveBeenNthCalledWith(1, "users", {
        name: "Pedro",
        email: "pedro@example.com",
        nickname: "pedro",
        dni: "12345678",
        password: "Secret123!",
      });
    });
    expect(post).toHaveBeenNthCalledWith(2, "stripe/generate", { user_id: 99 });
    expect(window.location.href).toBe("https://checkout.example.com/session");
  });

  test("shows an error when the created user cannot be identified", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    post.mockResolvedValueOnce({ data: {} });

    render(<Register />);

    await userEvent.type(screen.getByLabelText("Name"), "Pedro");
    await userEvent.type(screen.getByLabelText("Email"), "pedro@example.com");
    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(screen.getByLabelText("DNI"), "12345678");
    await userEvent.type(screen.getByLabelText("Password"), "Secret123!");
    await userEvent.click(screen.getByRole("button", { name: "Register and buy package" }));

    expect(await screen.findByText("Unable to identify the created user.")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("shows an error when the checkout session cannot be created", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    post
      .mockResolvedValueOnce({ data: { id: 99 } })
      .mockResolvedValueOnce({});

    render(<Register />);

    await userEvent.type(screen.getByLabelText("Name"), "Pedro");
    await userEvent.type(screen.getByLabelText("Email"), "pedro@example.com");
    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(screen.getByLabelText("DNI"), "12345678");
    await userEvent.type(screen.getByLabelText("Password"), "Secret123!");
    await userEvent.click(screen.getByRole("button", { name: "Register and buy package" }));

    expect(await screen.findByText("Unable to start the package checkout.")).toBeInTheDocument();
    expect(screen.getByText("Account created successfully. Redirecting to checkout...")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("toggles password visibility, shows API errors and navigates back to login", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    post.mockRejectedValue({ response: { data: { detail: "Email already exists" } } });

    render(<Register />);

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await userEvent.type(screen.getByLabelText("Name"), "Pedro");
    await userEvent.type(screen.getByLabelText("Email"), "pedro@example.com");
    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(screen.getByLabelText("DNI"), "12345678");
    await userEvent.type(passwordInput, "Secret123!");
    await userEvent.click(screen.getByRole("button", { name: "Register and buy package" }));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Back to login" }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("shows the fallback register error when the API returns no detail or message", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    post.mockRejectedValue({});

    render(<Register />);

    await userEvent.type(screen.getByLabelText("Name"), "Pedro");
    await userEvent.type(screen.getByLabelText("Email"), "pedro@example.com");
    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(screen.getByLabelText("DNI"), "12345678");
    await userEvent.type(screen.getByLabelText("Password"), "Secret123!");
    await userEvent.click(screen.getByRole("button", { name: "Register and buy package" }));

    expect(await screen.findByText("Unable to complete registration.")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("blocks weak passwords before sending the request", async () => {
    render(<Register />);

    await userEvent.type(screen.getByLabelText("Name"), "Pedro");
    await userEvent.type(screen.getByLabelText("Email"), "pedro@example.com");
    await userEvent.type(screen.getByLabelText("Nickname"), "pedro");
    await userEvent.type(screen.getByLabelText("DNI"), "12345678");
    await userEvent.type(screen.getByLabelText("Password"), "secret");
    await userEvent.click(screen.getByRole("button", { name: "Register and buy package" }));

    expect(
      await screen.findAllByText(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.",
      ),
    ).not.toHaveLength(0);
    expect(post).not.toHaveBeenCalled();
  });

});
