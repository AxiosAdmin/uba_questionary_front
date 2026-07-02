import { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../helpers/ContextApi";
import { post } from "../helpers/FecthApi";
import { removeAllSpaces } from "../helpers/userInputSanitizer";

const RecoverNickname = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useAppContext();
  const [token] = useState(() => searchParams.get("token")?.trim() || "");
  const [newNickname, setNewNickname] = useState("");
  const [updatedNickname, setUpdatedNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (token && searchParams.get("token")) {
      navigate("/recover-nickname", { replace: true });
      return;
    }

    if (!token) {
      setError(t("recoverNickname.invalidToken"));
    }
  }, [navigate, searchParams, t, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setUpdatedNickname("");

    if (!token) {
      setError(t("recoverNickname.invalidToken"));
      return;
    }

    const normalizedNickname = removeAllSpaces(newNickname);
    if (!normalizedNickname) {
      setError(t("recoverNickname.nicknameRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await post("recover-nickname", {
        token,
        new_nickname: normalizedNickname,
      });
      setSuccessMessage(response.message || t("recoverNickname.success"));
      setUpdatedNickname(response.nickname || normalizedNickname);
      setNewNickname("");
    } catch (err) {
      setError(err.response?.data?.detail || t("recoverNickname.failed"));
      console.error("Recover nickname error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <h2>{t("recoverNickname.title")}</h2>
        <p className="auth-helper-text">{t("recoverNickname.description")}</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="recoverNicknameNewNickname">
            <Form.Label>{t("recoverNickname.newNickname")}</Form.Label>
            <Form.Control
              type="text"
              value={newNickname}
              onChange={(event) => setNewNickname(removeAllSpaces(event.target.value))}
              placeholder={t("recoverNickname.newNickname")}
              autoComplete="username"
              disabled={!token || isSubmitting}
            />
          </Form.Group>
          {error ? <p className="auth-message auth-message-error">{error}</p> : null}
          {successMessage ? (
            <p className="auth-message auth-message-success">{successMessage}</p>
          ) : null}
          {updatedNickname ? (
            <p className="auth-helper-text">
              <strong>{t("recoverNickname.nicknameLabel")}:</strong> {updatedNickname}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-100"
            disabled={isSubmitting || !token || !removeAllSpaces(newNickname)}
          >
            {isSubmitting
              ? t("recoverNickname.submitting")
              : t("recoverNickname.submit")}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-100 mt-2 auth-link-button"
            onClick={() => navigate("/login")}
          >
            {t("recoverNickname.backToLogin")}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RecoverNickname;
