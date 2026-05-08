import { Form } from "react-bootstrap";
import { useAppContext } from "../helpers/ContextApi";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useAppContext();

  return (
    <div className="language-selector-shell">
      <Form.Label htmlFor="language-select" className="language-selector-label m-0">
        {t("language.label")}
      </Form.Label>
      <Form.Select
        id="language-select"
        size="sm"
        className="language-selector-input"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="es">{t("language.option.es")}</option>
        <option value="en">{t("language.option.en")}</option>
        <option value="pt">{t("language.option.pt")}</option>
      </Form.Select>
    </div>
  );
};

export default LanguageSelector;
