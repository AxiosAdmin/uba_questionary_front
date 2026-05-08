import { useState } from "react";
import { post } from "../helpers/FecthApi";
import { useAppContext } from "../helpers/ContextApi";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";

const AnatomyQuestionGenerator = () => {
  const [selectedTopicApiName, setSelectedTopicApiName] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    setQuestionData,
    resetQuestionState,
    isLoading,
    setIsLoading,
    resetQuestionData,
    incrementQuestionGenerationUsage,
    setQuestionGenerationUsage,
    t,
  } = useAppContext();
  const anatomyTopics = [
    { title: t("anatomy.topic.locomotor"), apiName: "Locomotor" },
    { title: t("anatomy.topic.splanchnology"), apiName: "Splanchnology" },
    { title: t("anatomy.topic.neuroanatomy"), apiName: "Neuroanatomy" },
  ];
  const selectedTopic =
    anatomyTopics.find((topic) => topic.apiName === selectedTopicApiName) || null;

  const generateQuestion = async (topic) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await post("ai/anatomy", { parameter: topic.apiName });
      resetQuestionState();
      resetQuestionData();
      setQuestionData(response.data);
      if (response.question_generation_usage) {
        setQuestionGenerationUsage(response.question_generation_usage);
      } else {
        incrementQuestionGenerationUsage();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail ||
          t("anatomy.generateFailed"),
      );
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = async (topic) => {
    setSelectedTopicApiName(topic.apiName);
    await generateQuestion(topic);
  };

  const handleChangeTopic = () => {
    setSelectedTopicApiName(null);
    setErrorMessage("");
    resetQuestionState();
    resetQuestionData();
  };

  const handleNextQuestion = async () => {
    if (!selectedTopic) {
      return;
    }

    await generateQuestion(selectedTopic);
  };

  return (
    <Row className="w-100 m-0 p-0 d-flex flex-column align-items-center">
      <Col className="px-5 pt-4">
        {errorMessage ? (
          <Alert variant="warning" className="mb-4">
            {errorMessage}
          </Alert>
        ) : null}
        {!selectedTopic ? (
          <>
            <h5>{t("anatomy.chooseTopic")}</h5>
            <Row className="g-3 justify-content-center">
              {anatomyTopics.map((topic) => (
                <Col
                  key={topic.title}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="d-flex"
                >
                  <Card
                    className="w-100 h-100"
                    role="button"
                    onClick={() => handleSelectTopic(topic)}
                  >
                    <Card.Body>{topic.title}</Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <>
            <div className="d-flex flex-column align-items-center gap-3">
              <h5 className="mb-0">
                {t("anatomy.selectedTopic")} <strong>{selectedTopic.title}</strong>
              </h5>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button variant="outline-light" onClick={handleChangeTopic}>
                  {t("anatomy.changeTopic")}
                </Button>
                <Button onClick={handleNextQuestion} disabled={isLoading}>
                  {t("anatomy.nextQuestion")}
                </Button>
              </div>
            </div>
          </>
        )}
        {isLoading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        )}
      </Col>
    </Row>
  );
};

export default AnatomyQuestionGenerator;
