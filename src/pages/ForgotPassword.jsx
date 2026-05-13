import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../helpers/ContextApi";
import { post } from "../helpers/FecthApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useAppContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await post("forgot-password", { email });
      setSuccessMessage(
        response.message || t("forgotPassword.success"),
      );
    } catch (err) {
      setError(err.response?.data?.detail || t("forgotPassword.failed"));
      console.error("Forgot password error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <h2>{t("forgotPassword.title")}</h2>
        <p className="auth-helper-text">{t("forgotPassword.description")}</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="forgotPasswordEmail">
            <Form.Label>{t("forgotPassword.email")}</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Form.Group>

          {error ? <p className="auth-message auth-message-error">{error}</p> : null}
          {successMessage ? (
            <p className="auth-message auth-message-success">{successMessage}</p>
          ) : null}

          <Button type="submit" className="w-100" disabled={isSubmitting}>
            {isSubmitting
              ? t("forgotPassword.submitting")
              : t("forgotPassword.submit")}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-100 mt-2 auth-link-button"
            onClick={() => navigate("/login")}
          >
            {t("forgotPassword.backToLogin")}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ForgotPassword;
