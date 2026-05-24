import Logo from "../Images/Logo.png";
import ShortLogo from "../Images/short_logo.png";
import { useEffect, useState } from "react";
import { Col, Dropdown, Row } from "react-bootstrap";
import { useAppContext } from "../helpers/ContextApi";
import { useNavigate } from "react-router-dom";

const MOBILE_BREAKPOINT = 576;
const getIsMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT;

const Header = () => {
  const {
    isAuthenticated,
    logout,
    questionGenerationUsage,
    requiresDniUpdate,
    language,
    setLanguage,
    t,
  } = useAppContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLimitsMenuOpen, setIsLimitsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(getIsMobileViewport);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      const updateViewport = () => {
        setIsMobileView(getIsMobileViewport());
      };

      updateViewport();
      window.addEventListener("resize", updateViewport);

      return () => window.removeEventListener("resize", updateViewport);
    }

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const updateViewport = (event) => {
      setIsMobileView(event?.matches ?? mediaQuery.matches);
    };

    updateViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateViewport);

      return () => mediaQuery.removeEventListener("change", updateViewport);
    }

    mediaQuery.addListener(updateViewport);

    return () => mediaQuery.removeListener(updateViewport);
  }, []);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsLimitsMenuOpen(false);
    setIsLanguageMenuOpen(false);
  };

  const handleNavigate = (path) => {
    closeMenus();
    navigate(path);
  };

  const handleLogout = () => {
    closeMenus();
    logout();
    navigate("/login");
  };

  const handleLanguageSelect = (nextLanguage) => {
    setLanguage(nextLanguage);
    closeMenus();
  };

  return (
    <Row className="header-shell w-100 m-0 p-0 py-4 px-4">
      {isAuthenticated ? (
        <>
          <Col xs="auto" className="d-flex align-items-center">
            <button
              type="button"
              className="header-logo-button"
              onClick={() => handleNavigate("/app")}
            >
              <img
                src={isMobileView ? ShortLogo : Logo}
                alt={t("header.logoAlt")}
                className={`header-logo${isMobileView ? " header-logo-mobile" : ""}`}
              />
            </button>
          </Col>
          <Col xs="auto" className="d-flex align-items-center ms-auto">
            <Dropdown
              align="end"
              show={isMenuOpen}
              onToggle={(nextShow) => {
                setIsMenuOpen(Boolean(nextShow));
                if (!nextShow) {
                  setIsLimitsMenuOpen(false);
                  setIsLanguageMenuOpen(false);
                }
              }}
            >
              <Dropdown.Toggle
                variant="outline-light"
                id="header-menu-toggle"
                className="header-menu-toggle"
                aria-label={t("header.menu")}
              >
                <i className="bi bi-list me-2" aria-hidden="true" />
                <span className="header-menu-toggle-label">
                  {t("header.menu")}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="header-menu-dropdown">
                <Dropdown.Item onClick={() => handleNavigate("/app")}>
                  <i className="bi bi-house-door me-2" aria-hidden="true" />
                  {t("header.home")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavigate("/profile")}>
                  <span className="d-flex align-items-center justify-content-between w-100">
                    <span>
                      <i className="bi bi-person-circle me-2" aria-hidden="true" />
                      {t("header.profile")}
                    </span>
                    {requiresDniUpdate ? (
                      <i
                        className="bi bi-exclamation-circle-fill text-warning"
                        aria-label={t("profile.dniPending")}
                      />
                    ) : null}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavigate("/answered-questions")}>
                  <i className="bi bi-journal-text me-2" aria-hidden="true" />
                  {t("header.myAnswers")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavigate("/feedback")}>
                  <i className="bi bi-chat-left-text me-2" aria-hidden="true" />
                  {t("header.feedback")}
                </Dropdown.Item>
                <button
                  type="button"
                  className="dropdown-item header-submenu-toggle"
                  onClick={() => {
                    setIsLimitsMenuOpen(!isLimitsMenuOpen);
                    setIsLanguageMenuOpen(false);
                  }}
                >
                  <span>
                    <i className="bi bi-speedometer2 me-2" aria-hidden="true" />
                    {t("header.limits")}
                  </span>
                  <i
                    className={`bi ${
                      isLimitsMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isLimitsMenuOpen ? (
                  <div className="header-submenu">
                    <div className="header-submenu-info">
                      <strong>{t("header.limitsUsed")}</strong>
                      <span>{questionGenerationUsage?.questions_used || 0}</span>
                    </div>
                    <div className="header-submenu-info">
                      <strong>{t("header.limitsCap")}</strong>
                      <span>
                        {typeof questionGenerationUsage?.questions_limit === "number"
                          ? questionGenerationUsage.questions_limit
                          : t("header.limitsUnavailableValue")}
                      </span>
                    </div>
                    <div className="header-submenu-info">
                      <strong>{t("header.limitsReset")}</strong>
                      <span>
                        {typeof questionGenerationUsage?.questions_remaining === "number"
                          ? questionGenerationUsage.questions_remaining
                          : t("header.limitsUnavailableValue")}
                      </span>
                    </div>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="dropdown-item header-submenu-toggle"
                  onClick={() => {
                    setIsLanguageMenuOpen(!isLanguageMenuOpen);
                    setIsLimitsMenuOpen(false);
                  }}
                >
                  <span>
                    <i className="bi bi-translate me-2" aria-hidden="true" />
                    {t("header.language")}
                  </span>
                  <i
                    className={`bi ${
                      isLanguageMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isLanguageMenuOpen ? (
                  <div className="header-submenu">
                    <button
                      type="button"
                      className={`header-submenu-item${
                        language === "es" ? " active" : ""
                      }`}
                      onClick={() => handleLanguageSelect("es")}
                    >
                      {t("language.option.es")}
                    </button>
                    <button
                      type="button"
                      className={`header-submenu-item${
                        language === "en" ? " active" : ""
                      }`}
                      onClick={() => handleLanguageSelect("en")}
                    >
                      {t("language.option.en")}
                    </button>
                    <button
                      type="button"
                      className={`header-submenu-item${
                        language === "pt" ? " active" : ""
                      }`}
                      onClick={() => handleLanguageSelect("pt")}
                    >
                      {t("language.option.pt")}
                    </button>
                  </div>
                ) : null}
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <i className="bi bi-box-arrow-right me-2 text-danger" aria-hidden="true" />
                  {t("header.logOut")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </>
      ) : (
        ""
      )}
    </Row>
  );
};

export default Header;
