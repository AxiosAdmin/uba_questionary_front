import Logo from "../Images/Logo.png";
import { Button, Col, Row } from "react-bootstrap";
import { useAppContext } from "../helpers/ContextApi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const {
    isAuthenticated,
    logout,
    authUser,
    questionGenerationUsage,
    formatDate,
    t,
  } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formattedCycleEnd = questionGenerationUsage?.cycle_end
    ? formatDate(questionGenerationUsage.cycle_end, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const usageResetTitle = formattedCycleEnd
    ? t("header.usageResetDate", { date: formattedCycleEnd })
    : t("header.usageResetUnavailable");

  return (
    <Row className="w-100 m-0 p-0 d-flex justify-content-between py-4 px-4">
      {isAuthenticated ? (
        <>
          <Col md={3} className="d-flex align-items-center justify-content-center justify-content-md-start">
            <img src={Logo} alt={t("header.logoAlt")} />
          </Col>
          <Col md={6} className="d-flex justify-content-center align-items-center">
            {authUser?.global_role !== "Admin" ? (
              <div className="text-center">
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span>{t("header.questionsThisMonth")}</span>
                  <i
                    className="bi bi-question-circle"
                    title={usageResetTitle}
                    style={{ cursor: "help" }}
                  />
                </div>
                <strong>
                  {questionGenerationUsage?.questions_used || 0}
                  {typeof questionGenerationUsage?.questions_limit === "number"
                    ? ` / ${questionGenerationUsage.questions_limit}`
                    : ""}
                </strong>
              </div>
            ) : null}
          </Col>
          <Col md={3} className="d-flex justify-content-center justify-content-md-end align-items-center">
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-end">
              <Button variant="outline-light" onClick={() => navigate("/app")}>
                {t("header.home")}
              </Button>
              <Button variant="outline-light" onClick={() => navigate("/answered-questions")}>
                {t("header.myAnswers")}
              </Button>
              <Button onClick={handleLogout}>{t("header.logOut")}</Button>
            </div>
          </Col>
        </>
      ) : (
        ""
      )}
    </Row>
  );
};

export default Header;
