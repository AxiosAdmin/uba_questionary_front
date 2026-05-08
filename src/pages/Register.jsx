import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { post } from "../helpers/FecthApi";

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
        throw new Error("Nao foi possivel identificar o usuario criado.");
      }

      setSuccess("Cadastro realizado com sucesso. Redirecionando para o checkout...");

      const checkoutResponse = await post("stripe/generate", { user_id: userId });

      if (!checkoutResponse?.url_session) {
        throw new Error("Nao foi possivel iniciar o checkout da assinatura.");
      }

      window.location.href = checkoutResponse.url_session;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Nao foi possivel realizar o cadastro.",
      );
      console.error("Register error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <Card.Body>
        <h2>Cadastro</h2>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="registerName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerNickname">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
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

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <Button type="submit" className="w-100" disabled={isSubmitting}>
            {isSubmitting ? "Redirecionando..." : "Cadastrar e assinar"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-100 mt-2"
            onClick={() => navigate("/login")}
          >
            Voltar para login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Register;
