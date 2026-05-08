import { useState } from "react";
import { Alert, Col, Row, Spinner } from "react-bootstrap";
import { post } from "../helpers/FecthApi";
import { useAppContext } from "../helpers/ContextApi";

const Question = () => {
  const {
    questionData,
    selectedAnswer,
    showResult,
    setSelectedAnswer,
    setShowResult,
    isLoading,
    getCurrentUserId,
  } = useAppContext();
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!questionData) {
    return null;
  }

  if (isLoading) {
    return (
      <Row className="w-100 m-0 p-0">
        <Col className="px-5 pt-4">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        </Col>
      </Row>
    );
  }

  const answers = [
    {
      letter: "A",
      text: questionData.answer_a,
      explanation: questionData.explanation_a,
    },
    {
      letter: "B",
      text: questionData.answer_b,
      explanation: questionData.explanation_b,
    },
    {
      letter: "C",
      text: questionData.answer_c,
      explanation: questionData.explanation_c,
    },
    {
      letter: "D",
      text: questionData.answer_d,
      explanation: questionData.explanation_d,
    },
    ...(questionData.answer_e
      ? [
          {
            letter: "E",
            text: questionData.answer_e,
            explanation: questionData.explanation_e,
          },
        ]
      : []),
  ];

  const correctAnswer = questionData.correct_answer;

  const handleAnswerClick = async (letter) => {
    if (!questionData?.id || isSavingAnswer) {
      return;
    }

    const userId = getCurrentUserId();

    if (!userId) {
      setErrorMessage("Nao foi possivel identificar o usuario autenticado.");
      return;
    }

    try {
      setIsSavingAnswer(true);
      setErrorMessage("");
      await post("question-answers", {
        answer: letter,
        question_id: questionData.id,
        user_id: userId,
      });
      setSelectedAnswer(letter);
      setShowResult(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail ||
          "Nao foi possivel salvar sua resposta. Tente novamente.",
      );
      console.error("Error saving question answer:", error);
    } finally {
      setIsSavingAnswer(false);
    }
  };

  const getButtonStyle = (letter) => {
    if (!showResult) {
      return {};
    }

    if (letter === correctAnswer) {
      return { backgroundColor: "#4CAF50", color: "white" };
    }

    if (letter === selectedAnswer) {
      return { backgroundColor: "#f44336", color: "white" };
    }

    return {};
  };

  return (
    <Row className="w-100 m-0 p-0">
      <Col className="px-5 pt-4">
        <h2>{questionData.question}</h2>
        {errorMessage ? (
          <Alert variant="danger" className="mb-4">
            {errorMessage}
          </Alert>
        ) : null}
        <Row className="g-3 justify-content-center">
          {answers.map((answer) => (
            <Col key={answer.letter} xs={12} md={10} lg={8} className="d-flex">
              <button
                type="button"
                className="card w-100 text-start"
                onClick={() => handleAnswerClick(answer.letter)}
                disabled={showResult || isSavingAnswer}
                style={getButtonStyle(answer.letter)}
              >
                <span className="card-body">
                  {answer.letter}) {answer.text}
                </span>
              </button>
            </Col>
          ))}
        </Row>
        {isSavingAnswer ? (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <Spinner animation="border" size="sm" variant="primary" />
            <span>Salvando sua resposta...</span>
          </div>
        ) : null}
        {showResult ? (
          <div>
            {answers.map((answer) => (
              <div key={answer.letter} style={{ marginTop: "10px" }}>
                <strong>
                  {answer.letter}) {answer.text}
                </strong>
                {answer.letter === correctAnswer ? (
                  <p style={{ color: "#4CAF50" }}>
                    Correta: {answer.explanation}
                  </p>
                ) : null}
                {answer.letter === selectedAnswer &&
                answer.letter !== correctAnswer ? (
                  <p style={{ color: "#f44336" }}>
                    Sua resposta: {answer.explanation}
                  </p>
                ) : null}
                {answer.letter !== correctAnswer &&
                answer.letter !== selectedAnswer ? (
                  <p style={{ color: "#eeeeee" }}>{answer.explanation}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </Col>
    </Row>
  );
};

export default Question;
