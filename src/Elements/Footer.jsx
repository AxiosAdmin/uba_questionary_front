import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../helpers/ContextApi";

const Footer = () => {
  const { t } = useAppContext();

  return (
    <Row className="w-100 m-0 p-0 d-flex justify-content-between py-4 px-4">
      <Col md={2} className="m-auto">
        {t("footer.developedBy")}
      </Col>
      <Col md="auto" className="m-auto">
        {t("footer.contact")}{" "}
        <a href="mailto:soporte@axiosacademia.com">
          soporte@axiosacademia.com
        </a>
        <a
          href="https://www.instagram.com/axios.academy/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram de Axios Academia"
          className="ms-3"
        >
          <i className="bi bi-instagram" aria-hidden="true" />
        </a>
      </Col>
    </Row>
  );
};

export default Footer;
