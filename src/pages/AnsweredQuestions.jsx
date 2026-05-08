import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { get } from "../helpers/FecthApi";
import { useAppContext } from "../helpers/ContextApi";

const buildAnswerOptions = (question) => {
  return [
    { letter: "A", text: question.answer_a },
    { letter: "B", text: question.answer_b },
    { letter: "C", text: question.answer_c },
    { letter: "D", text: question.answer_d },
    ...(question.answer_e ? [{ letter: "E", text: question.answer_e }] : []),
  ];
};

const getAnswerLabel = (question, answerLetter) => {
  const answer = buildAnswerOptions(question).find(
    (item) => item.letter === answerLetter,
  );

  if (!answer) {
    return answerLetter || "-";
  }

  return `${answer.letter}) ${answer.text}`;
};

const AnsweredQuestions = () => {
  const { getCurrentUserId, formatDateTime, t } = useAppContext();
  const userId = getCurrentUserId();
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadAnsweredQuestions = async () => {
      if (!userId) {
        setErrorMessage(t("answeredQuestions.userNotIdentified"));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await get(
          `question-answers/latest-answers?user_id=${encodeURIComponent(userId)}`,
        );
        setAnsweredQuestions(response?.data || []);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.detail ||
            t("answeredQuestions.loadFailed"),
        );
        console.error("Error loading answered questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnsweredQuestions();
  }, [t, userId]);

  return (
    <section className="answered-questions-page">
      <Container className="answered-questions-shell">
        <Row className="justify-content-center">
          <Col xl={11}>
            <Card className="answered-questions-card border-0">
              <Card.Body className="p-4 p-lg-5">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 text-start">
                  <div>
                    <Badge className="answered-questions-badge mb-3">
                      {t("answeredQuestions.badge")}
                    </Badge>
                    <h1 className="answered-questions-title mb-2">
                      {t("answeredQuestions.title")}
                    </h1>
                    <p className="answered-questions-subtitle mb-0">
                      {t("answeredQuestions.subtitle")}
                    </p>
                  </div>
                  <div className="answered-questions-count">
                    <span>{answeredQuestions.length}</span>
                    <small>{t("answeredQuestions.countLabel")}</small>
                  </div>
                </div>

                {errorMessage ? (
                  <Alert variant="danger" className="mb-4">
                    {errorMessage}
                  </Alert>
                ) : null}

                {isLoading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "240px" }}
                  >
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : answeredQuestions.length === 0 ? (
                  <Card className="answered-questions-empty border-0">
                    <Card.Body className="text-start">
                      <h2 className="h4 mb-2">
                        {t("answeredQuestions.emptyTitle")}
                      </h2>
                      <p className="mb-0 text-secondary">
                        {t("answeredQuestions.emptySubtitle")}
                      </p>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="answered-questions-table-wrap">
                    <Table responsive hover className="answered-questions-table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>{t("answeredQuestions.table.question")}</th>
                          <th>{t("answeredQuestions.table.subject")}</th>
                          <th>{t("answeredQuestions.table.yourAnswer")}</th>
                          <th>{t("answeredQuestions.table.correctAnswer")}</th>
                          <th>{t("answeredQuestions.table.answeredAt")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {answeredQuestions.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="answered-question-text">{item.question}</div>
                            </td>
                            <td>
                              <div className="fw-semibold">{item.topic}</div>
                              <div className="text-secondary small">{item.subject}</div>
                            </td>
                            <td>
                              <span className="answered-pill answered-pill-user">
                                {getAnswerLabel(item, item.user_answer)}
                              </span>
                            </td>
                            <td>
                              <span className="answered-pill answered-pill-correct">
                                {getAnswerLabel(item, item.correct_answer)}
                              </span>
                            </td>
                            <td>{formatDateTime(item.answered_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AnsweredQuestions;
