import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../helpers/ContextApi";
import { post } from "../helpers/FecthApi";
import { removeAllSpaces } from "../helpers/userInputSanitizer";

const ForgotNickname = () => {
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
      const response = await post("forgot-nickname", {
        email: removeAllSpaces(email),
      });
      setSuccessMessage(response.message || t("forgotNickname.success"));
    } catch (err) {
      setError(err.response?.data?.detail || t("forgotNickname.failed"));
      console.error("Forgot nickname error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <h2>{t("forgotNickname.title")}</h2>
        <p className="auth-helper-text">{t("forgotNickname.description")}</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="forgotNicknameEmail">
            <Form.Label>{t("forgotNickname.email")}</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(event) => setEmail(removeAllSpaces(event.target.value))}
              required
            />
          </Form.Group>

          {error ? <p className="auth-message auth-message-error">{error}</p> : null}
          {successMessage ? (
            <p className="auth-message auth-message-success">{successMessage}</p>
          ) : null}

          <Button type="submit" className="w-100" disabled={isSubmitting}>
            {isSubmitting
              ? t("forgotNickname.submitting")
              : t("forgotNickname.submit")}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-100 mt-2 auth-link-button"
            onClick={() => navigate("/login")}
          >
            {t("forgotNickname.backToLogin")}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ForgotNickname;
