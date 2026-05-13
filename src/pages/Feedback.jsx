import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../helpers/ContextApi";
import { post } from "../helpers/FecthApi";

const Feedback = () => {
  const { getCurrentUserId, t } = useAppContext();
  const navigate = useNavigate();
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const userId = getCurrentUserId();
    if (!userId) {
      setError(t("feedback.userNotIdentified"));
      return;
    }

    setIsSubmitting(true);

    try {
      await post("user-feedback", {
        user_id: userId,
        text_feedback: feedbackText.trim(),
      });
      setSuccessMessage(t("feedback.success"));
      setFeedbackText("");
    } catch (err) {
      setError(err.response?.data?.detail || t("feedback.failed"));
      console.error("Feedback error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <h2>{t("feedback.title")}</h2>
        <p className="auth-helper-text">{t("feedback.description")}</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="feedbackText">
            <Form.Label>{t("feedback.label")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={feedbackText}
              onChange={(event) => {
                setFeedbackText(event.target.value);
                setError("");
              }}
              placeholder={t("feedback.placeholder")}
              required
            />
          </Form.Group>

          {error ? <p className="auth-message auth-message-error">{error}</p> : null}
          {successMessage ? (
            <p className="auth-message auth-message-success">{successMessage}</p>
          ) : null}

          <Button
            type="submit"
            className="w-100"
            disabled={isSubmitting || !feedbackText.trim()}
          >
            {isSubmitting ? t("feedback.submitting") : t("feedback.submit")}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-100 mt-2 auth-link-button"
            onClick={() => navigate("/app")}
          >
            {t("feedback.backToHome")}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Feedback;
