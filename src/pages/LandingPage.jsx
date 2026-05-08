import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../helpers/ContextApi";

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useAppContext();

  const planHighlights = [
    {
      icon: "bi-stars",
      title: t("landing.highlight.multipleChoice.title"),
      description: t("landing.highlight.multipleChoice.description"),
    },
    {
      icon: "bi-lightning-charge",
      title: t("landing.highlight.essays.title"),
      description: t("landing.highlight.essays.description"),
    },
    {
      icon: "bi-bar-chart-line",
      title: t("landing.highlight.mockExams.title"),
      description: t("landing.highlight.mockExams.description"),
    },
  ];

  const planFeatures = [t("landing.feature.questionLimit")];

  const availableSubjects = [
    {
      icon: "bi bi-check-circle-fill",
      title: t("landing.subject.anatomy"),
    },
    {
      icon: "bi bi-hourglass-split",
      title: t("landing.subject.histology"),
    },
    {
      icon: "bi bi-hourglass-split",
      title: t("landing.subject.embryology"),
    },
    {
      icon: "bi bi-hourglass-split",
      title: t("landing.subject.molecularBiology"),
    },
    {
      icon: "bi bi-hourglass-split",
      title: t("landing.subject.genetics"),
    },
  ];

  return (
    <section className="landing-page">
      <Container className="landing-hero">
        <Row className="align-items-center g-4 g-xl-5">
          <Col lg={7} className="text-start">
            <h1 className="landing-title">{t("landing.title")}</h1>
            <p className="landing-subtitle">{t("landing.subtitle")}</p>

            <Row className="g-3 mt-4">
              {planHighlights.map((item) => (
                <Col md={4} key={item.title}>
                  <Card className="landing-mini-card h-100">
                    <Card.Body>
                      <div className="landing-icon-wrap">
                        <i className={`bi ${item.icon}`} />
                      </div>
                      <Card.Title className="landing-mini-title">
                        {item.title}
                      </Card.Title>
                      <Card.Text className="landing-mini-text">
                        {item.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          <Col lg={5}>
            <Card className="landing-plan-card border-0">
              <Card.Body className="p-4 p-lg-5 text-start">
                <h2 className="landing-plan-title">{t("landing.planTitle")}</h2>

                <div className="landing-feature-list">
                  {planFeatures.map((feature) => (
                    <div className="landing-feature-item" key={feature}>
                      <i className="bi bi-check-circle-fill" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="landing-subjects-block">
                  <h3 className="landing-subjects-title">
                    {t("landing.subjectsTitle")}
                  </h3>
                  <div className="landing-subject-list">
                    {availableSubjects.map((subject) => (
                      <div className="landing-feature-item" key={subject.title}>
                        <i className={subject.icon} />
                        <span>{subject.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="landing-actions">
                  <Button
                    size="lg"
                    className="landing-primary-button"
                    onClick={() => navigate("/register")}
                  >
                    {t("landing.createAccount")}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline-light"
                    className="landing-secondary-button"
                    onClick={() => navigate("/login")}
                  >
                    {t("landing.alreadyHaveAccount")}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default LandingPage;
