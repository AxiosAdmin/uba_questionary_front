import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../helpers/ContextApi";
import { get, post } from "../helpers/FecthApi";

const SubjectSelection = () => {
  const {
    authUser,
    getCurrentUserId,
    hasSubscriptionAccess,
    hasQuestionPackageAvailable,
    logout,
    requiresDniUpdate,
    refreshSubscriptionAccess,
    selectedInstitution,
    setSelectedInstitution,
    t,
  } = useAppContext();
  const navigate = useNavigate();
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const subjects = [
    {
      text: t("landing.subject.anatomy"),
      route: "anatomy",
    },
    {
      text: t("landing.subject.biology"),
      route: "biology",
    }
  ];

  const handleClickSubject = (subjectRoute) => {
    navigate(`/${subjectRoute}`);
  };

  const getInstitution = async () => {
    if (selectedInstitution) {
      return selectedInstitution;
    }

    const response = await get("institutions");
    const institution = response.data.find((item) => item.name === "UBA") || null;

    if (institution) {
      setSelectedInstitution(institution);
    }

    return institution;
  };

  const handleGenerateCheckout = async () => {
    if (requiresDniUpdate) {
      setError(t("subjectSelection.checkoutBlockedByDni"));
      setInfoMessage("");
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      setError(t("subjectSelection.userNotIdentified"));
      return;
    }

    setIsPreparingCheckout(true);
    setError("");
    setInfoMessage("");

    try {
      const response = await post("stripe/generate", { user_id: userId });
      if (response?.url_session) {
        logout();
        window.location.href = response.url_session;
        return;
      }

      setError(t("subjectSelection.checkoutStartFailed"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          t("subjectSelection.checkoutStartFailed"),
      );
    } finally {
      setIsPreparingCheckout(false);
    }
  };

  const handleRefreshAccess = async () => {
    setError("");
    setInfoMessage("");

    try {
      const hasAccess = await refreshSubscriptionAccess();
      if (!hasAccess) {
        setInfoMessage(t("subjectSelection.paymentPending"));
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          t("subjectSelection.subscriptionStatusFailed"),
      );
    }
  };

  useEffect(() => {
    getInstitution();
    // eslint-disable-next-line
  }, []);

  const isPackageExhausted =
    hasSubscriptionAccess && !hasQuestionPackageAvailable;

  if (!hasSubscriptionAccess) {
    return (
      <Row className="w-100 m-0 p-0 justify-content-center">
        <Col xs={12} md={9} lg={7} xl={6} className="px-4 pt-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5 text-start">
              <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
                <div>
                  <p className="text-uppercase small mb-2 text-warning">
                    {t("subjectSelection.pendingBadge")}
                  </p>
                  <h2 className="mb-2">{t("subjectSelection.pendingTitle")}</h2>
                  <p className="mb-0 text-secondary">
                    {t("subjectSelection.pendingDescription")}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-stretch gap-2">
                  <div className="bg-warning-subtle rounded-pill px-3 py-2 text-dark fw-semibold text-center">
                    {t("subjectSelection.planLabel")}
                  </div>
                  <div className="bg-light rounded-pill px-3 py-2 text-dark fw-semibold text-center">
                    {t("subjectSelection.planPrice")}
                  </div>
                </div>
              </div>

              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Card className="h-100 border-light-subtle">
                    <Card.Body>
                      <Card.Title className="h5">
                        {t("subjectSelection.step1Title")}
                      </Card.Title>
                      <Card.Text className="text-secondary">
                        {t("subjectSelection.step1Description")}
                      </Card.Text>
                      <Button
                        className="w-100"
                        onClick={handleGenerateCheckout}
                        disabled={isPreparingCheckout || requiresDniUpdate}
                      >
                        {isPreparingCheckout ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            {t("subjectSelection.openingCheckout")}
                          </>
                        ) : (
                          t("subjectSelection.subscribeNow")
                        )}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100 border-light-subtle">
                    <Card.Body>
                      <Card.Title className="h5">
                        {t("subjectSelection.step2Title")}
                      </Card.Title>
                      <Card.Text className="text-secondary">
                        {t("subjectSelection.step2Description")}
                      </Card.Text>
                      <Button variant="outline-secondary" className="w-100" onClick={handleRefreshAccess}>
                        {t("subjectSelection.alreadyPaid")}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {requiresDniUpdate ? (
                <Alert variant="warning" className="mb-3">
                  {t("subjectSelection.dniUpdateRequired")}
                  <div className="mt-3">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => navigate("/profile")}
                    >
                      {t("subjectSelection.openProfile")}
                    </Button>
                  </div>
                </Alert>
              ) : null}

              {infoMessage ? (
                <Alert variant="warning" className="mb-3">
                  {infoMessage}
                </Alert>
              ) : null}

              {error ? (
                <Alert variant="danger" className="mb-0">
                  {error}
                </Alert>
              ) : null}

              <p className="small text-secondary mt-4 mb-0">
                {t("subjectSelection.connectedUser")}{" "}
                <strong>
                  {authUser?.nickname ||
                    authUser?.name ||
                    t("subjectSelection.activeAccount")}
                </strong>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="w-100 m-0 p-0">
      <Col className="px-5 pt-4">
        {isPackageExhausted ? (
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4 p-md-5 text-start">
              <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
                <div>
                  <p className="text-uppercase small mb-2 text-warning">
                    {t("subjectSelection.exhaustedBadge")}
                  </p>
                  <h2 className="mb-2">{t("subjectSelection.exhaustedTitle")}</h2>
                  <p className="mb-0 text-secondary">
                    {t("subjectSelection.exhaustedDescription")}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-start align-items-md-end gap-2">
                  <div className="bg-warning-subtle rounded-pill px-3 py-2 text-dark fw-semibold">
                    {t("subjectSelection.planLabel")}
                  </div>
                  <div className="bg-light rounded-pill px-3 py-2 text-dark fw-semibold">
                    {t("subjectSelection.planPrice")}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerateCheckout}
                disabled={isPreparingCheckout || requiresDniUpdate}
              >
                {isPreparingCheckout ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {t("subjectSelection.openingCheckout")}
                  </>
                ) : (
                  t("subjectSelection.buyAnotherPackage")
                )}
              </Button>

              {requiresDniUpdate ? (
                <Alert variant="warning" className="mt-3 mb-0">
                  {t("subjectSelection.dniUpdateRequired")}
                  <div className="mt-3">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => navigate("/profile")}
                    >
                      {t("subjectSelection.openProfile")}
                    </Button>
                  </div>
                </Alert>
              ) : null}

              {error ? (
                <Alert variant="danger" className="mt-3 mb-0">
                  {error}
                </Alert>
              ) : null}
            </Card.Body>
          </Card>
        ) : (
          <>
            {requiresDniUpdate ? (
              <Alert variant="warning" className="mb-4">
                {t("subjectSelection.dniUpdateRequired")}
                <div className="mt-3">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => navigate("/profile")}
                  >
                    {t("subjectSelection.openProfile")}
                  </Button>
                </div>
              </Alert>
            ) : null}
            <h5>{t("subjectSelection.chooseSubject")}</h5>
            <Row className="g-3 justify-content-center">
              {subjects.map((subject, index) => (
                <Col
                  key={`${subject.text}-${index}`}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="d-flex"
                >
                  <Card
                    className="w-100 h-100"
                    role="button"
                    onClick={() => handleClickSubject(subject.route)}
                  >
                    <Card.Body>{subject.text}</Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
        <div className="d-flex justify-content-center mt-4">
          <Button variant="outline-light" onClick={() => navigate("/answered-questions")}>
            {t("subjectSelection.viewMyAnswers")}
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default SubjectSelection;
