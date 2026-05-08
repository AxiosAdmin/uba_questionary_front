import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { post } from "../helpers/FecthApi";
import { useAppContext } from "../helpers/ContextApi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordView, setPasswordView] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { t } = useAppContext();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const createUserResponse = await post("users", {
        name,
        email,
        nickname,
        password,
      });
      const userId = createUserResponse?.data?.id;

      if (!userId) {
        throw new Error(t("register.userNotIdentified"));
      }

      setSuccess(t("register.successRedirect"));

      const checkoutResponse = await post("stripe/generate", { user_id: userId });

      if (!checkoutResponse?.url_session) {
        throw new Error(t("register.checkoutStartFailed"));
      }

      window.location.href = checkoutResponse.url_session;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          t("register.failed"),
      );
      console.error("Register error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <Card.Body>
        <h2>{t("register.title")}</h2>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="registerName">
            <Form.Label>{t("register.name")}</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>{t("register.email")}</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerNickname">
            <Form.Label>{t("register.nickname")}</Form.Label>
            <Form.Control
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>{t("register.password")}</Form.Label>
            <Form.Control
              type={passwordView ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Button
              type="button"
              variant="secondary"
              className="mt-2"
              onClick={() => setPasswordView(!passwordView)}
            >
              {passwordView
                ? t("register.hidePassword")
                : t("register.showPassword")}
            </Button>
          </Form.Group>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <Button type="submit" className="w-100" disabled={isSubmitting}>
            {isSubmitting ? t("register.redirecting") : t("register.submit")}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-100 mt-2"
            onClick={() => navigate("/login")}
          >
            {t("register.backToLogin")}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Register;
