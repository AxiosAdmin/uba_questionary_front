import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../helpers/ContextApi";
import { post } from "../helpers/FecthApi";

const Login = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordView, setPasswordView] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await post("login", { nickname, password });

      if (response.user && response.token) {
        login(
          response.user,
          response.token,
          response.question_generation_usage || null,
        );
        navigate("/");
        return;
      }

      if (response.user) {
        login(response.user, null, response.question_generation_usage || null);
        navigate("/");
        return;
      }

      setError("Resposta invalida do servidor.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Login falhou. Verifique suas credenciais e tente novamente.",
      );
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <Card.Body>
        <h2>Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="loginNickname">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
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
              {passwordView ? "Hide" : "Show"} Password
            </Button>
          </Form.Group>

          {error ? <p style={{ color: "red" }}>{error}</p> : null}

          <Button type="submit" className="w-100" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-100 mt-2"
            onClick={() => navigate("/register")}
          >
            Criar conta
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;
