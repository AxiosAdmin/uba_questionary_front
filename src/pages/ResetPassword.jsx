import { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../helpers/ContextApi";
import { post } from "../helpers/FecthApi";
import { getPasswordValidationMessage } from "../helpers/passwordValidation";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useAppContext();
  const [token] = useState(() => searchParams.get("token")?.trim() || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const newPasswordValidationMessage = getPasswordValidationMessage(newPassword, t);
  const confirmPasswordValidationMessage = getPasswordValidationMessage(confirmPassword, t);

  useEffect(() => {
    if (token && searchParams.get("token")) {
      navigate("/reset-password", { replace: true });
      return;
    }

    if (!token) {
      setError(t("resetPassword.invalidToken"));
    }
  }, [navigate, searchParams, t, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError(t("resetPassword.invalidToken"));
      return;
    }

    if (newPasswordValidationMessage) {
      setError(newPasswordValidationMessage);
      return;
    }

    if (confirmPasswordValidationMessage) {
      setError(confirmPasswordValidationMessage);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("resetPassword.passwordMismatch"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await post("reset-password", {
        token,
        new_password: newPassword,
      });
      setSuccessMessage(response.message || t("resetPassword.success"));
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.detail || t("resetPassword.failed"));
      console.error("Reset password error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <h2>{t("resetPassword.title")}</h2>
        <p className="auth-helper-text">{t("resetPassword.description")}</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="resetPasswordNewPassword">
            <Form.Label>{t("resetPassword.newPassword")}</Form.Label>
            <Form.Control
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setError("");
              }}
              required
              disabled={!token || isSubmitting}
              isInvalid={Boolean(newPasswordValidationMessage)}
            />
            <Form.Text className="auth-helper-text">
              {t("password.requirements")}
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {newPasswordValidationMessage}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="resetPasswordConfirmPassword">
            <Form.Label>{t("resetPassword.confirmPassword")}</Form.Label>
            <Form.Control
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setError("");
              }}
              required
              disabled={!token || isSubmitting}
              isInvalid={Boolean(confirmPasswordValidationMessage)}
            />
            <Form.Text className="auth-helper-text">
              {t("password.requirements")}
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {confirmPasswordValidationMessage}
            </Form.Control.Feedback>
            <Button
              type="button"
              variant="secondary"
              className="mt-2"
              onClick={() => setShowPasswords(!showPasswords)}
              disabled={!token}
            >
              {showPasswords ? t("login.hidePassword") : t("login.showPassword")}
            </Button>
          </Form.Group>

          {error ? <p className="auth-message auth-message-error">{error}</p> : null}
          {successMessage ? (
            <p className="auth-message auth-message-success">{successMessage}</p>
          ) : null}

          <Button type="submit" className="w-100" disabled={isSubmitting || !token}>
            {isSubmitting
              ? t("resetPassword.submitting")
              : t("resetPassword.submit")}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-100 mt-2 auth-link-button"
            onClick={() => navigate("/login")}
          >
            {t("resetPassword.backToLogin")}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ResetPassword;
