import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../../Elements/Header";
import { useAppContext } from "../../helpers/ContextApi";
import { createMockAppContext } from "../utils/mockAppContext";

const mockNavigate = jest.fn();
const originalMatchMedia = window.matchMedia;
const originalInnerWidth = window.innerWidth;

jest.mock("../../helpers/ContextApi", () => ({
  useAppContext: jest.fn(),
}));

jest.mock("react-bootstrap", () => {
  const actual = jest.requireActual("react-bootstrap");
  const ReactLib = require("react");
  const DropdownContext = ReactLib.createContext({
    show: false,
    onToggle: () => {},
  });

  const Dropdown = ({ show = false, onToggle = () => {}, children }) => (
    <DropdownContext.Provider value={{ show, onToggle }}>
      <div>{children}</div>
    </DropdownContext.Provider>
  );

  Dropdown.Toggle = ReactLib.forwardRef(
    ({ children, onClick, id, className, "aria-label": ariaLabel }, ref) => {
      const { show, onToggle } = ReactLib.useContext(DropdownContext);

      return (
        <button
          ref={ref}
          type="button"
          id={id}
          className={className}
          aria-label={ariaLabel}
          aria-expanded={show ? "true" : "false"}
          onClick={(event) => {
            onClick?.(event);
            onToggle(!show);
          }}
        >
          {children}
        </button>
      );
    },
  );

  Dropdown.Menu = ({ children, className }) => {
    const { show } = ReactLib.useContext(DropdownContext);
    return show ? <div className={className}>{children}</div> : null;
  };

  Dropdown.Item = ({ children, onClick, className }) => (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );

  return {
    ...actual,
    Dropdown,
  };
});

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = originalMatchMedia;
    window.innerWidth = originalInnerWidth;
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
    window.innerWidth = originalInnerWidth;
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
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        logout,
        setLanguage,
        questionGenerationUsage: {
          questions_used: 4,
          questions_limit: 10,
          questions_remaining: 6,
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
    await waitFor(() => expect(screen.getByText("Profile")).toBeInTheDocument());
    await userEvent.click(screen.getByText("Profile"));

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await waitFor(() => expect(screen.getByText("My answers")).toBeInTheDocument());
    await userEvent.click(screen.getByText("My answers"));

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await waitFor(() => expect(screen.getByText("Feedback")).toBeInTheDocument());
    await userEvent.click(screen.getByText("Feedback"));

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await waitFor(() => expect(screen.getByText("Limits")).toBeInTheDocument());
    await userEvent.click(screen.getByText("Limits"));
    await waitFor(() => expect(screen.getByText("Used from package")).toBeInTheDocument());
    expect(screen.getByText("Package size")).toBeInTheDocument();
    expect(screen.getByText("Remaining")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Language"));
    await waitFor(() => expect(screen.getByRole("button", { name: /Portug/i })).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /Portug/i }));

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, "/app");
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "/profile");
    expect(mockNavigate).toHaveBeenNthCalledWith(3, "/answered-questions");
    expect(mockNavigate).toHaveBeenNthCalledWith(4, "/feedback");
    expect(setLanguage).toHaveBeenCalledWith("pt");
    expect(logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenNthCalledWith(5, "/login");
  });

  test("navigates home when the authenticated user clicks the logo", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
      }),
    );

    render(<Header />);

    await userEvent.click(screen.getByAltText("Project logo"));

    expect(mockNavigate).toHaveBeenCalledWith("/app");
  });

  test("closes open submenus when the main menu is toggled closed", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        questionGenerationUsage: {
          questions_used: 4,
          questions_limit: 10,
          questions_remaining: 6,
        },
      }),
    );

    render(<Header />);

    const menuButton = screen.getByRole("button", { name: "Menu" });

    await userEvent.click(menuButton);
    await userEvent.click(screen.getByText("Limits"));
    expect(await screen.findByText("Used from package")).toBeInTheDocument();

    await userEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.queryByText("Used from package")).not.toBeInTheDocument();
      expect(screen.queryByText("Home")).not.toBeInTheDocument();
    });
  });

  test("shows unavailable values inside the limits submenu when usage metadata is incomplete", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        questionGenerationUsage: {
          questions_used: 4,
          questions_limit: null,
          questions_remaining: null,
        },
      }),
    );

    render(<Header />);

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await userEvent.click(screen.getByText("Limits"));

    expect(await screen.findByText("Used from package")).toBeInTheDocument();
    expect(screen.getAllByText("Not available")).toHaveLength(2);
  });

  test("marks the current language as active and allows selecting Spanish from the submenu", async () => {
    const setLanguage = jest.fn();
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        language: "en",
        setLanguage,
      }),
    );

    render(<Header />);

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await userEvent.click(screen.getByText("Language"));

    const englishButton = await screen.findByRole("button", { name: "English" });
    const spanishButton = screen.getByRole("button", { name: /Espa/i });
    const portugueseButton = screen.getByRole("button", { name: /Portug/i });

    expect(englishButton).toHaveClass("active");
    expect(spanishButton).not.toHaveClass("active");
    expect(portugueseButton).not.toHaveClass("active");

    await userEvent.click(spanishButton);

    expect(setLanguage).toHaveBeenCalledWith("es");
  });

  test("marks Spanish as active, allows selecting English, and closes the limits submenu when language opens", async () => {
    const setLanguage = jest.fn();
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        language: "es",
        setLanguage,
        questionGenerationUsage: {
          questions_used: 4,
          questions_limit: 10,
          questions_remaining: 6,
        },
      }),
    );

    render(<Header />);

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await userEvent.click(screen.getByText("Limites"));
    expect(await screen.findByText("Usadas del paquete")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Idioma"));

    await waitFor(() => {
      expect(screen.queryByText("Usadas del paquete")).not.toBeInTheDocument();
    });

    const spanishButton = await screen.findByRole("button", { name: /Espa/i });
    const englishButton = screen.getByRole("button", { name: "English" });

    expect(spanishButton).toHaveClass("active");
    expect(englishButton).not.toHaveClass("active");

    await userEvent.click(englishButton);

    expect(setLanguage).toHaveBeenCalledWith("en");
  });

  test("updates the logo for mobile view when matchMedia change events fire", async () => {
    let changeHandler;
    const addEventListener = jest.fn((eventName, handler) => {
      if (eventName === "change") {
        changeHandler = handler;
      }
    });
    const removeEventListener = jest.fn();

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addEventListener,
      removeEventListener,
    }));

    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
      }),
    );

    const { unmount } = render(<Header />);

    const logo = screen.getByAltText("Project logo");
    expect(logo).not.toHaveClass("header-logo-mobile");

    await act(async () => {
      changeHandler?.({ matches: true });
    });

    await waitFor(() => {
      expect(screen.getByAltText("Project logo")).toHaveClass("header-logo-mobile");
    });

    unmount();

    expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  test("shows a warning indicator on the profile item when the user still needs to update the dni", async () => {
    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
        requiresDniUpdate: true,
      }),
    );

    render(<Header />);

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));

    expect(
      await screen.findByLabelText(
        "Your account still needs a valid DNI. Update your data below to complete your registration.",
      ),
    ).toBeInTheDocument();
  });

  test("falls back to legacy matchMedia listeners when addEventListener is unavailable", () => {
    const addListener = jest.fn();
    const removeListener = jest.fn();

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener,
      removeListener,
    }));

    useAppContext.mockReturnValue(
      createMockAppContext({
        isAuthenticated: true,
      }),
    );

    const { unmount } = render(<Header />);

    expect(addListener).toHaveBeenCalledWith(expect.any(Function));

    unmount();

    expect(removeListener).toHaveBeenCalledWith(expect.any(Function));
  });
});
