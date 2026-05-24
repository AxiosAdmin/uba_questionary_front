import { useEffect, useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { get, put } from "../helpers/FecthApi";
import { useAppContext } from "../helpers/ContextApi";

const Profile = () => {
  const { requiresDniUpdate, t, updateAuthUserProfile } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nickname: "",
    dni: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await get("users/me");
        const user = response?.data;

        if (!user) {
          throw new Error(t("profile.loadFailed"));
        }

        setFormData({
          name: user.name || "",
          email: user.email || "",
          nickname: user.nickname || "",
          dni: user.dni || "",
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.detail ||
            requestError.message ||
            t("profile.loadFailed"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [t]);

  const handleChange = (field) => (event) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: event.target.value,
    }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const response = await put("users/me", formData);
      const user = response?.data;

      if (!user) {
        throw new Error(t("profile.saveFailed"));
      }

      setFormData({
        name: user.name || "",
        email: user.email || "",
        nickname: user.nickname || "",
        dni: user.dni || "",
      });
      updateAuthUserProfile(user);
      setSuccessMessage(t("profile.success"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          t("profile.saveFailed"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="auth-card">
      <Card.Body>
        <h2>{t("profile.title")}</h2>
        <p className="auth-helper-text">{t("profile.description")}</p>

        {requiresDniUpdate ? (
          <Alert variant="warning">{t("profile.dniPending")}</Alert>
        ) : null}

        {isLoading ? (
          <div className="d-flex align-items-center justify-content-center py-4">
            <Spinner className="me-2" size="sm" />
            <span>{t("profile.loading")}</span>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="profileName">
              <Form.Label>{t("register.name")}</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="profileEmail">
              <Form.Label>{t("register.email")}</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="profileNickname">
              <Form.Label>{t("register.nickname")}</Form.Label>
              <Form.Control
                type="text"
                value={formData.nickname}
                onChange={handleChange("nickname")}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="profileDni">
              <Form.Label>{t("register.dni")}</Form.Label>
              <Form.Control
                type="text"
                value={formData.dni}
                onChange={handleChange("dni")}
                placeholder={t("register.dniPlaceholder")}
                disabled={!requiresDniUpdate}
                required
              />
              <Form.Text className="auth-helper-text">
                {requiresDniUpdate ? t("register.dniHelp") : t("profile.dniLocked")}
              </Form.Text>
            </Form.Group>

            {error ? <p className="auth-message auth-message-error">{error}</p> : null}
            {successMessage ? (
              <p className="auth-message auth-message-success">{successMessage}</p>
            ) : null}

            <Button type="submit" className="w-100" disabled={isSaving}>
              {isSaving ? t("profile.saving") : t("profile.submit")}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-100 mt-2 auth-link-button"
              onClick={() => navigate("/app")}
            >
              {t("profile.backToHome")}
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default Profile;
