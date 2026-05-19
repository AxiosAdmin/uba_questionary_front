import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

jest.mock("react-router-dom", () => {
  const ReactLib = require("react");
  const RouterContext = ReactLib.createContext({
    navigate: () => {},
    path: "/",
  });

  const MemoryRouterMock = ({ initialEntries = ["/"], children }) => {
    const [path, setPath] = ReactLib.useState(initialEntries[0]);
    const navigate = ReactLib.useCallback((nextPath) => {
      setPath(nextPath);
    }, []);

    return (
      <RouterContext.Provider value={{ navigate, path }}>
        {children}
      </RouterContext.Provider>
    );
  };

  const RoutesMock = ({ children }) => {
    const { path } = ReactLib.useContext(RouterContext);
    const matchedRoute = ReactLib.Children.toArray(children).find(
      (child) => child.props.path === path,
    );

    return matchedRoute ? matchedRoute.props.element : null;
  };

  const RouteMock = () => null;

  const NavigateMock = ({ to }) => {
    const navigate = ReactLib.useContext(RouterContext).navigate;

    ReactLib.useEffect(() => {
      navigate(to);
    }, [navigate, to]);

    return null;
  };

  return {
    MemoryRouter: MemoryRouterMock,
    Navigate: NavigateMock,
    Route: RouteMock,
    Routes: RoutesMock,
    useLocation: () => ({ pathname: ReactLib.useContext(RouterContext).path }),
    useNavigate: () => ReactLib.useContext(RouterContext).navigate,
  };
}, { virtual: true });

jest.mock("../pages/LandingPage", () => () => <div>landing-page</div>);
jest.mock("../pages/Login", () => () => <div>login-page</div>);
jest.mock("../pages/ForgotPassword", () => () => <div>forgot-password-page</div>);
jest.mock("../pages/Register", () => () => <div>register-page</div>);
jest.mock("../pages/ResetPassword", () => () => <div>reset-password-page</div>);
jest.mock("../pages/SubjectSelection", () => () => <div>subject-selection-page</div>);
jest.mock("../pages/AnatomyQuestionGenerator", () => () => <div>anatomy-generator-page</div>);
jest.mock("../pages/BiologyQuestionGenerator", () => () => <div>biology-generator-page</div>);
jest.mock("../pages/Question", () => () => <div>question-page</div>);
jest.mock("../pages/AnsweredQuestions", () => () => <div>answered-questions-page</div>);
jest.mock("../pages/Feedback", () => () => <div>feedback-page</div>);
jest.mock("../Elements/Header", () => () => <div>header</div>);
jest.mock("../Elements/Footer", () => () => <div>footer</div>);
jest.mock("../Elements/LanguageSelector", () => () => <div>language-selector</div>);

const renderAppAt = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );

describe("App routes", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders the landing page for unauthenticated visitors", () => {
    renderAppAt("/");

    expect(screen.getByText("landing-page")).toBeInTheDocument();
    expect(screen.queryByText("subject-selection-page")).not.toBeInTheDocument();
  });

  test("redirects authenticated users from the landing page to the app home", () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 1, institution_id: 4 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 4, name: "UBA" }));

    renderAppAt("/");

    expect(screen.getByText("subject-selection-page")).toBeInTheDocument();
  });

  test("redirects unauthenticated users trying to open anatomy to login", () => {
    renderAppAt("/anatomy");

    expect(screen.getByText("login-page")).toBeInTheDocument();
  });

  test("redirects authenticated users without active access back to the app home", () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 1 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 4, name: "UBA" }));

    renderAppAt("/anatomy");

    expect(screen.getByText("subject-selection-page")).toBeInTheDocument();
  });

  test("redirects unauthenticated users trying to open biology to login", () => {
    renderAppAt("/biology");

    expect(screen.getByText("login-page")).toBeInTheDocument();
  });

  test("renders the anatomy flow only when auth, subscription access and institution are present", () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 1, institution_id: 4 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 4, name: "UBA" }));

    renderAppAt("/anatomy");

    expect(screen.getByText("anatomy-generator-page")).toBeInTheDocument();
    expect(screen.getByText("question-page")).toBeInTheDocument();
  });

  test("renders the biology flow only when auth, subscription access and institution are present", () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 1, institution_id: 4 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 4, name: "UBA" }));

    renderAppAt("/biology");

    expect(screen.getByText("biology-generator-page")).toBeInTheDocument();
    expect(screen.getByText("question-page")).toBeInTheDocument();
  });

  test("redirects authenticated users with an exhausted package back to the app home", () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 1, institution_id: 4 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 4, name: "UBA" }));
    localStorage.setItem(
      "question_generation_usage",
      JSON.stringify({ questions_used: 150, questions_limit: 150, questions_remaining: 0 }),
    );

    renderAppAt("/anatomy");

    expect(screen.getByText("subject-selection-page")).toBeInTheDocument();
  });

  test("redirects authenticated users without a selected institution to the app route", () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 1, institution_id: 4 }));

    renderAppAt("/login");

    expect(screen.getByText("subject-selection-page")).toBeInTheDocument();
  });

  test("redirects authenticated users away from register to the app route", () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 1, institution_id: 4 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 4, name: "UBA" }));

    renderAppAt("/register");

    expect(screen.getByText("subject-selection-page")).toBeInTheDocument();
  });

  test("renders forgot-password for public access", () => {
    renderAppAt("/forgot-password");

    expect(screen.getByText("forgot-password-page")).toBeInTheDocument();
  });

  test("renders reset-password for public access", () => {
    renderAppAt("/reset-password");

    expect(screen.getByText("reset-password-page")).toBeInTheDocument();
  });

  test("renders feedback only for authenticated users", () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 1, institution_id: 4 }));

    renderAppAt("/feedback");

    expect(screen.getByText("feedback-page")).toBeInTheDocument();
  });

  test("redirects unauthenticated users from feedback to login", () => {
    renderAppAt("/feedback");

    expect(screen.getByText("login-page")).toBeInTheDocument();
  });
});
