import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const planHighlights = [
  {
    icon: "bi-stars",
    title: "Choices gerados por IA",
    description:
      "Receba perguntas objetivas de anatomia com foco em estudo rapido e treino recorrente.",
  },
  {
    icon: "bi-lightning-charge",
    title: "Discursivas geradas e avaliadas por IA (Em Breve)",
    description:
      "Receba perguntas, envie as resposta e receba uma avaliação com pontos de melhoria e possíveis correções de conteúdo",
  },
  {
    icon: "bi-bar-chart-line",
    title: "Gere simulados (Em Breve)",
    description:
      "Responda questões em sequência para simular um comportamento de provas",
  },
];

const planFeatures = ["Ate 150 geracoes de questoes por mês"];

const availableSubjects = [
  {
    icon: "bi bi-check-circle-fill",
    title: "Anatomia",
  },
  {
    icon: "bi bi-hourglass-split",
    title: "Histologia (Em breve)",
  },
  {
    icon: "bi bi-hourglass-split",
    title: "Embriologia (Em breve)",
  },
  {
    icon: "bi bi-hourglass-split",
    title: "Biologia molecular (Em breve)",
  },
  {
    icon: "bi bi-hourglass-split",
    title: "Genetica (Em breve)",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-page">
      <Container className="landing-hero">
        <Row className="align-items-center g-4 g-xl-5">
          <Col lg={7} className="text-start">
            {/* <Badge className="landing-badge mb-3">Plano Basic UBA</Badge> */}
            <h1 className="landing-title">UBA Trainer</h1>
            <p className="landing-subtitle">
              Plataforma para treinar para as suas provas de Anatomia da UBA
            </p>

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
                <h2 className="landing-plan-title">Plano Basic</h2>

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
                    Materias presentes na aplicacao
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
                    Criar conta e assinar
                  </Button>
                  <Button
                    size="lg"
                    variant="outline-light"
                    className="landing-secondary-button"
                    onClick={() => navigate("/login")}
                  >
                    Ja tenho conta
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
