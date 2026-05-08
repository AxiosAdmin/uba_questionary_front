import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../helpers/ContextApi";

const Footer = () => {
  const { t } = useAppContext();

  return (
    <Row className="w-100 m-0 p-0 d-flex justify-content-between py-4 px-4">
      <Col md={2} className="m-auto">
        {t("footer.developedBy")}
      </Col>
    </Row>
  );
};

export default Footer;
