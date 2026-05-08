import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../helpers/ContextApi";
import { get, post } from "../helpers/FecthApi";

const subjects = [
  {
    text: "Anatomy",
    route: "anatomy",
  },
];

const SubjectSelection = () => {
  const {
    authUser,
    getCurrentUserId,
    hasSubscriptionAccess,
    refreshSubscriptionAccess,
    selectedInstitution,
    setSelectedInstitution,
  } = useAppContext();
  const navigate = useNavigate();
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false);
  const [isRefreshingAccess, setIsRefreshingAccess] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

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
    const userId = getCurrentUserId();
    if (!userId) {
      setError("Nao foi possivel identificar o usuario autenticado.");
      return;
    }

    setIsPreparingCheckout(true);
    setError("");
    setInfoMessage("");

    try {
      const response = await post("stripe/generate", { user_id: userId });
      if (response?.url_session) {
        window.location.href = response.url_session;
        return;
      }

      setError("Nao foi possivel iniciar o checkout da assinatura.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Nao foi possivel iniciar o checkout da assinatura.",
      );
    } finally {
      setIsPreparingCheckout(false);
    }
  };

  const handleRefreshAccess = async () => {
    setIsRefreshingAccess(true);
    setError("");
    setInfoMessage("");

    try {
      const hasAccess = await refreshSubscriptionAccess();
      if (!hasAccess) {
        setInfoMessage(
          "O pagamento ainda esta em processamento ou a assinatura nao foi liberada.",
        );
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Nao foi possivel verificar o status da assinatura.",
      );
    } finally {
      setIsRefreshingAccess(false);
    }
  };

  useEffect(() => {
    getInstitution();
    // eslint-disable-next-line
  }, []);

  if (!hasSubscriptionAccess) {
    return (
      <Row className="w-100 m-0 p-0 justify-content-center">
        <Col xs={12} md={9} lg={7} xl={6} className="px-4 pt-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5 text-start">
              <div className="d-flex justify-content-between align-items-start flex-column flex-md-row gap-3 mb-4">
                <div>
                  <p className="text-uppercase small mb-2 text-warning">
                    Assinatura pendente
                  </p>
                  <h2 className="mb-2">Ative seu acesso para usar a plataforma</h2>
                  <p className="mb-0 text-secondary">
                    Seu login ja esta liberado. Para usar as rotas protegidas da
                    aplicacao, finalize a assinatura no Stripe e depois atualize o
                    status do acesso.
                  </p>
                </div>
                <div className="bg-warning-subtle rounded-pill px-3 py-2 text-dark fw-semibold">
                  Plano Basic UBA
                </div>
              </div>

              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Card className="h-100 border-light-subtle">
                    <Card.Body>
                      <Card.Title className="h5">1. Concluir pagamento</Card.Title>
                      <Card.Text className="text-secondary">
                        Gere a sessao do checkout e finalize a assinatura com o
                        Stripe.
                      </Card.Text>
                      <Button
                        className="w-100"
                        onClick={handleGenerateCheckout}
                        disabled={isPreparingCheckout}
                      >
                        {isPreparingCheckout ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Abrindo checkout...
                          </>
                        ) : (
                          "Assinar agora"
                        )}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100 border-light-subtle">
                    <Card.Body>
                      <Card.Title className="h5">2. Liberar acesso</Card.Title>
                      <Card.Text className="text-secondary">
                        Depois do pagamento, verifique se a API ja recebeu os eventos
                        do Stripe.
                      </Card.Text>
                      <Button
                        variant="outline-light"
                        className="w-100"
                        onClick={handleRefreshAccess}
                        disabled={isRefreshingAccess}
                      >
                        {isRefreshingAccess ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Verificando...
                          </>
                        ) : (
                          "Ja paguei, verificar acesso"
                        )}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

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
                Usuario conectado:{" "}
                <strong>{authUser?.nickname || authUser?.name || "Conta ativa"}</strong>
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
        <h5>Choose your subject</h5>
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
        <div className="d-flex justify-content-center mt-4">
          <Button variant="outline-light" onClick={() => navigate("/answered-questions")}>
            Ver minhas respostas
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default SubjectSelection;
