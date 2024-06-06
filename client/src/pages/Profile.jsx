import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
  Modal,
  Pagination,
} from "react-bootstrap";
import { useAuth } from "../utils/auth/useAuth";
import { FaStar } from "react-icons/fa";
import "../styles/Profile.css";
import AppNavbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// Componente profilo
const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [joinDate, setJoinDate] = useState(user ? user.createdAt : "");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState(null);
  const [alertType, setAlertType] = useState("info");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const profileResponse = await fetch(
          "http://localhost:8001/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Profile data could not be fetched.");
        }

        const profileData = await profileResponse.json();

        if (!profileData || !profileData._id) {
          throw new Error("Profile data is null or does not contain _id.");
        }

        setName(profileData.name);
        setEmail(profileData.email);
        setJoinDate(profileData.createdAt);

        const bookingsResponse = await fetch(
          `http://localhost:8001/bookings/${profileData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!bookingsResponse.ok) {
          throw new Error("Bookings data could not be fetched.");
        }

        const bookingsData = await bookingsResponse.json();
        const activeBookings = bookingsData.filter(
          (booking) => booking.status !== "cancelled"
        );
        setBookings(activeBookings);

        const reviewsResponse = await fetch(
          `http://localhost:8001/reviews/user/${profileData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!reviewsResponse.ok) {
          throw new Error("Reviews data could not be fetched.");
        }

        const reviewsData = await reviewsResponse.json();
        setSubmittedReviews(reviewsData.map((review) => review.tour._id));
      } catch (error) {
        setMessage(`Error fetching data: ${error.message}`);
        setAlertType("danger");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Funzione per aggiornare il profilo
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8001/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setAlertType("success");
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update profile: ${errorData.message}`);
        setAlertType("danger");
      }
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
      setAlertType("danger");
    }
  };

  // Funzione per gestire il cambiamento del nome
  const handleNameChange = (e) => {
    setName(e.target.value);
    setMessage(null); // Clear message when changing the name
  };

  // Funzione per cancellare una prenotazione
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8001/bookings/${selectedBooking._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setBookings(
          bookings.filter((booking) => booking._id !== selectedBooking._id)
        );
        setNotificationMessage("Your reservation has been cancelled.");
        setSelectedBooking(null);
        setShowCancelModal(false);
        setShowNotificationModal(true);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to cancel booking: ${errorData.message}`);
        setAlertType("danger");
      }
    } catch (error) {
      setMessage(`Error canceling booking: ${error.message}`);
      setAlertType("danger");
    }
  };

  // Funzione per scrivere una recensione
  const handleWriteReview = async () => {
    if (!selectedBooking) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8001/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tour: selectedBooking.tour._id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (response.ok) {
        setReviewRating(0);
        setReviewComment("");
        setSubmittedReviews([...submittedReviews, selectedBooking.tour._id]);
        setSelectedBooking(null);
        setShowReviewModal(false);
        setNotificationMessage("Review submission completed");
        setShowNotificationModal(true);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to submit review: ${errorData.message}`);
        setAlertType("danger");
      }
    } catch (error) {
      setMessage(`Error submitting review: ${error.message}`);
      setAlertType("danger");
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Funzione per renderizzare le prenotazioni
  const renderBookings = () => {
    if (!bookings || bookings.length === 0) {
      return <p>You have no bookings.</p>;
    }

    const indexOfLastBooking = currentPage * itemsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
    const currentBookings = bookings.slice(
      indexOfFirstBooking,
      indexOfLastBooking
    );

    return currentBookings.map((booking) => {
      if (!booking || !booking.tour) return null;

      const bookingDate = new Date(booking.bookingDate);
      const isPastBooking = bookingDate < new Date();
      const hasSubmittedReview = submittedReviews.includes(booking.tour._id);

      return (
        <Col key={booking._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card id="profile-card">
            <Card.Img
              variant="top"
              src={booking.tour.images[0]}
              id="profile-card-img"
              alt={booking.tour.title}
            />
            <Card.Body id="profile-card-body">
              <Card.Title id="profile-card-title">
                {booking.tour.title}
              </Card.Title>
              <Card.Text id="profile-card-text">
                {booking.tour.description}
              </Card.Text>
            </Card.Body>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                Date: {new Date(booking.bookingDate).toLocaleDateString()}
              </li>
              <li className="list-group-item">People: {booking.people}</li>
              <li className="list-group-item">Price: ${booking.price}</li>
            </ul>
            <Card.Body id="profile-card-buttons">
              {isPastBooking ? (
                hasSubmittedReview ? (
                  <>
                    <Button variant="primary" disabled>
                      Review Submitted
                    </Button>
                    <Button variant="secondary" disabled>
                      Used
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowReviewModal(true);
                      }}
                    >
                      Write a Review
                    </Button>
                    <Button variant="secondary" disabled>
                      Used
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button variant="primary" disabled>
                    Write a Review
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowCancelModal(true);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      );
    });
  };

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Container className="my-5">
          <h2>Loading...</h2>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container className="my-5" id="profile_container">
        <h2 className="my-5">Profile</h2>
        {message && <Alert variant={alertType}>{message}</Alert>}
        <Form onSubmit={handleUpdateProfile}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              className="mb-4"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) =>
                (e.target.placeholder = user ? user.name : "Enter your name")
              }
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              className="mb-4"
              value={email}
              readOnly
              disabled
              placeholder="Enter your email"
            />
          </Form.Group>
          <Form.Group controlId="joinDate">
            <Form.Label>Joined On</Form.Label>
            <Form.Control
              type="text"
              className="mb-4"
              value={new Date(joinDate).toLocaleDateString()}
              readOnly
              disabled
            />
          </Form.Group>
          <Button type="submit" className="my-3">
            Update Profile
          </Button>
        </Form>
        <h3 className="my-5">My Bookings</h3>
        <Row id="profile-bookings-container">{renderBookings()}</Row>
        {bookings.length > 0 && (
          <Pagination className="justify-content-center mt-4">
            <Pagination.First onClick={() => paginate(1)} />
            <Pagination.Prev
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            />
            {[...Array(Math.ceil(bookings.length / itemsPerPage)).keys()].map(
              (number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              )
            )}
            <Pagination.Next
              onClick={() =>
                currentPage < Math.ceil(bookings.length / itemsPerPage) &&
                paginate(currentPage + 1)
              }
            />
            <Pagination.Last
              onClick={() =>
                paginate(Math.ceil(bookings.length / itemsPerPage))
              }
            />
          </Pagination>
        )}
      </Container>
      <Footer />

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this booking?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleCancelBooking}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reviewRating">
              <Form.Label>Rating</Form.Label>
              <div>
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    color={index < reviewRating ? "#FFD700" : "#E4E5E9"}
                    size={24}
                    onClick={() => setReviewRating(index + 1)}
                    style={{ cursor: "pointer", marginRight: 5 }}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group controlId="reviewComment" className="mt-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleWriteReview}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showNotificationModal}
        onHide={() => setShowNotificationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{notificationMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => setShowNotificationModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
