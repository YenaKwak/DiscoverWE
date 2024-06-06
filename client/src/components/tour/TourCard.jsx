import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "../../styles/TourCard.css";
import { useAuth } from "../../utils/auth/useAuth";

const TourCard = ({
  tour,
  onReserve,
  onViewReviews,
  bookedTours = [],
  style,
  isProfilePage = false,
}) => {
  const { images, title, description, price, tags, rating, reviews, region } =
    tour;
  const [showModal, setShowModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [people, setPeople] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState([]);
  const { user } = useAuth();

  // Controlla se l'utente ha già prenotato il tour
  useEffect(() => {
    const checkIfBooked = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:8001/bookings/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              tourId: tour._id,
            }),
          });
          const data = await response.json();
          setIsBooked(data.isBooked);
        } catch (error) {
          console.error("Error checking if tour is booked:", error);
        }
      }
    };

    checkIfBooked();
  }, [user, tour._id]);

  // Rende le stelle della valutazione
  const renderStars = (rating) => {
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      rating = 0;
    }
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <FaStar key={i} color="#FFD700" />
          ))}
        {hasHalfStar && <FaStarHalfAlt color="#FFD700" />}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <FaRegStar key={i} color="#FFD700" />
          ))}
      </>
    );
  };

  // Gestisce la prenotazione del tour
  const handleReserve = async () => {
    if (!user) {
      setAlertMessage("You need to log in.");
      setShowAlertModal(true);
      return;
    }

    if (isBooked) {
      setAlertMessage("You've already booked this");
      setShowAlertModal(true);
      return;
    }

    setShowModal(true);
  };

  // Gestisce la visualizzazione delle recensioni del tour
  const handleViewReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:8001/reviews/tour/${tour._id}`
      );
      const data = await response.json();
      console.log("Reviews data received:", data);

      if (data.length > 0) {
        setModalTitle("View Reviews");
        setModalMessage(
          data.map((review, index) => (
            <div key={index} className="review-item">
              <div className="user-info-reviews">
                <strong>{review.user}</strong>
                <span>{renderStars(review.rating)}</span>
                <span>
                  {review.bookingDate
                    ? new Date(review.bookingDate).toLocaleDateString()
                    : "No booking date"}
                </span>
              </div>
              <p>{review.comment}</p>
            </div>
          ))
        );
        setModalShow(true);
      } else {
        setAlertMessage("There are no reviews.");
        setShowAlertModal(true);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Gestisce l'immagine successiva
  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Gestisce l'immagine precedente
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Gestisce il clic sull'immagine per aprire il modal
  const handleImageClick = () => {
    setModalImageIndex(currentImage);
    setShowImageModal(true);
  };

  // Gestisce l'immagine successiva nel modal
  const handleModalNextImage = (e) => {
    e.stopPropagation();
    setModalImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Gestisce l'immagine precedente nel modal
  const handleModalPrevImage = (e) => {
    e.stopPropagation();
    setModalImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Gestisce la chiusura del modal di avviso
  const handleAlertModalClose = () => {
    setShowAlertModal(false);
  };

  // Gestisce la prenotazione del tour
  const handleBooking = async () => {
    if (!bookingDate) {
      setAlertMessage("Select the date.");
      setShowAlertModal(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user: user._id,
          tour: tour._id,
          bookingDate,
          people,
          price,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Booking request failed");
      }

      setAlertMessage(
        <div className="d-flex flex-column text-center">
          <div>"{tour.title}"</div>
          <div>Your booking has been completed.</div>
          <div>
            Date: {bookingDate}, People: {people}
          </div>
        </div>
      );
      setIsBooked(true);
      setShowAlertModal(true);
      onReserve(tour._id);
      setShowModal(false);
    } catch (error) {
      console.error("Error booking tour:", error);
      setAlertMessage(
        error.message || "An error occurred while creating the reservation."
      );
      setShowAlertModal(true);
    }
  };

  return (
    <>
      <Card className="tour-card" style={style}>
        <div className="tour-carousel-inner" onClick={handleImageClick}>
          <img
            className="tour-carousel-image"
            src={images[currentImage]}
            alt={`Slide ${currentImage}`}
            style={{ cursor: "zoom-in" }}
          />
          <button className="carousel-control-prev" onClick={handlePrevImage}>
            &#9664;
          </button>
          <button className="carousel-control-next" onClick={handleNextImage}>
            &#9654;
          </button>
        </div>
        <Card.Body>
          <div className="title-region">
            <Card.Title>{title}</Card.Title>
            <span className="region-tag">{region}</span>
          </div>
          <Card.Text>{description}</Card.Text>
          <Card.Text>Price: ${price}</Card.Text>
          {tags && tags.length > 0 && (
            <Card.Text>
              {tags.map((tag, index) => (
                <span key={index} className="tour-tag">
                  {tag}
                </span>
              ))}
            </Card.Text>
          )}
          <div className="tour-rating">
            <div className="tour-stars">
              {renderStars(rating)}
              <span className="tour-reviews">({reviews.length} reviews)</span>
            </div>
            <div className="tour-button-group">
              {!isProfilePage && (
                <>
                  <Button
                    variant={isBooked ? "danger" : "primary"}
                    onClick={handleReserve}
                    disabled={isBooked}
                  >
                    {isBooked ? "Booked" : "Book"}
                  </Button>
                  <Button variant="secondary" onClick={handleViewReviews}>
                    View a review
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
      <hr />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Make a Booking!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="bookingDate">
            <Form.Label>Select the date</Form.Label>
            <Form.Control
              type="date"
              lang="en"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </Form.Group>
          <Form.Group controlId="people">
            <Form.Label>People</Form.Label>
            <Form.Control
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              min="1"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleBooking()}>
            Book
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>View</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="modal-image-container">
            <img
              className="img-fluid"
              src={images[modalImageIndex]}
              alt={`Slide ${modalImageIndex}`}
              style={{ width: "100%" }}
            />
            <button
              className="modal-carousel-control-prev"
              onClick={handleModalPrevImage}
            >
              &#9664;
            </button>
            <button
              className="modal-carousel-control-next"
              onClick={handleModalNextImage}
            >
              &#9654;
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showAlertModal} onHide={handleAlertModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alertMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAlertModalClose}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="reviews-modal-body">{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TourCard;
