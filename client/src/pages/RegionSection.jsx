import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/RegionSection.css";

// Componente per visualizzare le sezioni delle regioni
const RegionSection = () => {
  const navigate = useNavigate();

  // Funzione per gestire il clic su una regione e navigare ai dettagli
  const handleViewDetails = (region) => {
    navigate(`/search?region=${region}`);
  };

  return (
    <Container className="marketing my-4">
      <h3 className="marketing-title text-center mt-5 pb-3">
        Explore Regions of Italy
      </h3>
      <Row className="justify-content-center">
        <Col
          lg={4}
          md={6}
          sm={12}
          className="d-flex justify-content-center mb-3 region-names"
          onClick={() => handleViewDetails("central")}
        >
          <div className="region-card">
            <div className="image-container">
              <img
                src="/assets/region/central.jpg"
                alt="Central"
                className="region-image"
              />
              <div className="overlay">
                <div className="text">Central</div>
              </div>
            </div>
          </div>
        </Col>
        <Col
          lg={4}
          md={6}
          sm={12}
          className="d-flex justify-content-center mb-3"
          onClick={() => handleViewDetails("southern")}
        >
          <div className="region-card">
            <div className="image-container">
              <img
                src="/assets/region/southern.jpg"
                alt="Southern"
                className="region-image"
              />
              <div className="overlay">
                <div className="text">Southern</div>
              </div>
            </div>
          </div>
        </Col>
        <Col
          lg={4}
          md={6}
          sm={12}
          className="d-flex justify-content-center mb-3"
          onClick={() => handleViewDetails("northern")}
        >
          <div className="region-card">
            <div className="image-container">
              <img
                src="/assets/region/northern.jpg"
                alt="Northern"
                className="region-image"
              />
              <div className="overlay">
                <div className="text">Northern</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegionSection;
