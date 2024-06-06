import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Accordion, Form } from "react-bootstrap";
import TourCard from "../components/tour/TourCard";
import AlertModal from "../components/common/AlertModal";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { FaStar, FaRegStar } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import { Range, getTrackBackground } from "react-range";
import "../styles/SearchResults.css";

// Componente principale per i risultati della ricerca
const SearchResults = () => {
  const [tours, setTours] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const regionParam = searchParams.get("region") || "";
  const queryParam = searchParams.get("query") || "";

  // Effettua una chiamata API per recuperare i tour
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/tours/search/tours?region=${regionParam}&query=${queryParam}&minPrice=${
            priceRange[0]
          }&maxPrice=${priceRange[1]}&reviews=${selectedReviews.join(
            ","
          )}&location=${locationFilter}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTours(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, [regionParam, queryParam, priceRange, selectedReviews, locationFilter]);

  // Gestione della visualizzazione delle recensioni
  const handleViewReviews = (tour) => {
    setModalTitle("View Reviews");
    setModalMessage(
      tour.reviews.length > 0
        ? tour.reviews.map((review, index) => (
            <div key={index}>
              <strong>
                {review.user && review.user.name
                  ? review.user.name.split(" ")[0]
                  : "Unknown User"}
              </strong>
              : {review.comment}
            </div>
          ))
        : "No reviews available."
    );
    setModalShow(true);
  };

  // Reset di tutti i filtri
  const resetAllFilters = () => {
    setPriceRange([0, 500]);
    setSelectedReviews([]);
    setLocationFilter("");
  };

  // Selezione/deselezione delle recensioni
  const toggleReviewSelection = (rating) => {
    setSelectedReviews((prevSelectedReviews) => {
      if (prevSelectedReviews.includes(rating)) {
        return prevSelectedReviews.filter((r) => r !== rating);
      } else {
        return [...prevSelectedReviews, rating];
      }
    });
  };

  // Opzioni di localizzazione in base alla regione
  const getLocationOptions = (regionParam) => {
    switch (regionParam.toLowerCase()) {
      case "central":
        return (
          <>
            <option value="Lazio">Lazio</option>
            <option value="Toscana">Toscana</option>
          </>
        );
      case "southern":
        return (
          <>
            <option value="Campania">Campania</option>
            <option value="Sicilia">Sicilia</option>
          </>
        );
      case "northern":
        return (
          <>
            <option value="Genova">Genova</option>
            <option value="Milano">Milano</option>
            <option value="Venezia">Venezia</option>
          </>
        );
      default:
        return (
          <>
            <option value="Lazio">Lazio</option>
            <option value="Toscana">Toscana</option>
            <option value="Campania">Campania</option>
            <option value="Sicilia">Sicilia</option>
            <option value="Genova">Genova</option>
            <option value="Milano">Milano</option>
            <option value="Venezia">Venezia</option>
          </>
        );
    }
  };

  return (
    <>
      <Navbar />
      <Container className="search-results-container">
        <div className="result-caption-text">
          <h2 className="text-center my-4">Results</h2>
          <p>{`Results for "${regionParam || queryParam}" ${
            tours.length
          } results found`}</p>
        </div>
        <hr style={{ borderBottom: "1px solid black" }} />
        <Row>
          <Col lg={3} className="filter-col">
            <div className="filter-header">
              <h4>Filter</h4>
              <Button variant="link" onClick={resetAllFilters}>
                <p>
                  Reset all
                  <RxReset />
                </p>
              </Button>
            </div>
            <div id="search-filter-wrap">
              <Accordion defaultActiveKey="" alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Price range</Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Group controlId="formPriceRange">
                        <div id="price-range-bar-container">
                          <Range
                            values={priceRange}
                            step={1}
                            min={0}
                            max={500}
                            onChange={(values) => setPriceRange(values)}
                            renderTrack={({ props, children }) => (
                              <div
                                {...props}
                                style={{
                                  ...props.style,
                                  height: "6px",
                                  width: "100%",
                                  background: getTrackBackground({
                                    values: priceRange,
                                    colors: [
                                      "#ccc",
                                      "rgba(103, 200, 30, 0.4)",
                                      "#ccc",
                                    ],
                                    min: 0,
                                    max: 500,
                                  }),
                                }}
                              >
                                {children}
                              </div>
                            )}
                            renderThumb={({ props, isDragged }) => (
                              <div
                                {...props}
                                style={{
                                  ...props.style,
                                  height: "16px",
                                  width: "16px",
                                  backgroundColor: "green",
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    height: "8px",
                                    width: "8px",
                                    backgroundColor: isDragged
                                      ? "green"
                                      : "#ccc",
                                    borderRadius: "50%",
                                  }}
                                />
                              </div>
                            )}
                          />
                        </div>
                        <div id="price-range-values-container">
                          <div className="price-range-values">
                            <span>{`€${priceRange[0]}`}</span>
                            <span>{` - `}</span>
                            <span>{`€${priceRange[1]}`}</span>
                          </div>
                          <Button
                            variant="link"
                            onClick={() => setPriceRange([0, 500])}
                          >
                            <RxReset />
                          </Button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Review Rating</Accordion.Header>
                  <Accordion.Body id="review-accordion">
                    <Form>
                      <Form.Group controlId="formReview">
                        <div id="review-filter-container">
                          <div className="review-filter">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <div
                                key={rating}
                                className={`star-rating ${
                                  selectedReviews.includes(rating)
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => toggleReviewSelection(rating)}
                              >
                                {[...Array(rating)].map((_, i) => (
                                  <FaStar key={i} color="#FFD700" />
                                ))}
                                {[...Array(5 - rating)].map((_, i) => (
                                  <FaRegStar key={i} color="#FFD700" />
                                ))}
                              </div>
                            ))}
                          </div>
                          <Button
                            variant="link"
                            onClick={() => setSelectedReviews([])}
                          >
                            <RxReset />
                          </Button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Location</Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      <Form.Group controlId="formLocation">
                        <div id="form-location-container">
                          <Form.Control
                            as="select"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                          >
                            <option className="select-region-option" value="">
                              All {regionParam} regions
                            </option>
                            {getLocationOptions(regionParam)}
                          </Form.Control>
                          <Button
                            variant="link"
                            onClick={() => setLocationFilter("")}
                          >
                            <RxReset />
                          </Button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </Col>
          <Col lg={9}>
            <div className="grid-container">
              {tours.length > 0 ? (
                tours.map((tour) => (
                  <div key={tour._id} className="grid-item">
                    <TourCard
                      tour={tour}
                      onReserve={() => {}}
                      onViewReviews={handleViewReviews}
                      style={{ width: "100%" }}
                    />
                  </div>
                ))
              ) : (
                <p>There are no matching results.</p>
              )}
            </div>
          </Col>
        </Row>
        <AlertModal
          show={modalShow}
          handleClose={() => setModalShow(false)}
          title={modalTitle}
          message={modalMessage}
        />
      </Container>
      <Footer />
    </>
  );
};

export default SearchResults;
