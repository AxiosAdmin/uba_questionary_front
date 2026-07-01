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
    t,
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
      setErrorMessage(t("question.userNotIdentified"));
      return;
    }

    try {
      setIsSavingAnswer(true);
      setErrorMessage("");
      await post("question-answers", {
        answer: letter,
        question_id: questionData.id,
      });
      setSelectedAnswer(letter);
      setShowResult(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail ||
          t("question.saveFailed"),
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

  const getExplanationPresentation = (answer) => {
    if (answer.letter === correctAnswer) {
      return {
        className: "question-answer-explanation question-answer-explanation-correct",
        style: { color: "#4CAF50" },
        text: `${t("question.correct")} ${answer.explanation ?? ""}`,
      };
    }

    if (answer.letter === selectedAnswer) {
      return {
        className: "question-answer-explanation question-answer-explanation-selected",
        style: { color: "#f44336" },
        text: `${t("question.yourAnswer")} ${answer.explanation ?? ""}`,
      };
    }

    return {
      className: "question-answer-explanation question-answer-explanation-neutral",
      style: { color: "#eeeeee" },
      text: answer.explanation ?? "",
    };
  };

  return (
    <section className="question-page">
      <Row className="w-100 m-0 p-0">
        <Col className="question-shell">
          <h2 className="question-title">{questionData.question}</h2>
          {errorMessage ? (
            <Alert variant="danger" className="mb-4">
              {errorMessage}
            </Alert>
          ) : null}
          <Row className="g-3 justify-content-center question-answers-row">
            {answers.map((answer) => {
              const explanationPresentation = getExplanationPresentation(answer);

              return (
                <Col key={answer.letter} xs={12} md={10} lg={8} className="d-flex">
                  <div className="question-answer-stack w-100">
                    <button
                      type="button"
                      className="question-answer-button card w-100 text-start"
                      onClick={() => handleAnswerClick(answer.letter)}
                      disabled={showResult || isSavingAnswer}
                      style={getButtonStyle(answer.letter)}
                    >
                      <span className="question-answer-body">
                        {answer.letter}) {answer.text}
                      </span>
                    </button>
                    {showResult ? (
                      <div
                        className={explanationPresentation.className}
                        style={explanationPresentation.style}
                        data-testid={`answer-explanation-${answer.letter}`}
                      >
                        <p className="question-answer-explanation-text">
                          {explanationPresentation.text}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </Col>
              );
            })}
          </Row>
          {isSavingAnswer ? (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
              <Spinner animation="border" size="sm" variant="primary" />
              <span>{t("question.savingAnswer")}</span>
            </div>
          ) : null}
        </Col>
      </Row>
    </section>
  );
};

export default Question;
