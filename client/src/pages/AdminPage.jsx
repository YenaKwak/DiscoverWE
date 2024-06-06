import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Table, Tabs, Tab } from "react-bootstrap";
import AppNavbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [tours, setTours] = useState([]);
  const [newTour, setNewTour] = useState({
    title: "",
    description: "",
    price: 0,
    region: "",
    location: "",
    tags: "",
    images: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const navigate = useNavigate();

  // Controllo del token dell'admin e fetching dei tour
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
    } else {
      fetchTours();
    }
  }, [navigate]);

  // Funzione per ottenere i tour dal server
  const fetchTours = async () => {
    try {
      const response = await fetch("http://localhost:8001/tours", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  // Gestione dei cambiamenti degli input per un nuovo tour
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTour({ ...newTour, [name]: value });
  };

  // Gestione del cambiamento delle immagini per un nuovo tour
  const handleImageChange = (e) => {
    setNewTour({ ...newTour, images: [...e.target.files] });
  };

  // Gestione dei cambiamenti degli input per l'editing di un tour
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditTour({ ...editTour, [name]: value });
  };

  // Gestione del cambiamento delle immagini per l'editing di un tour
  const handleEditImageChange = (e) => {
    setEditTour({ ...editTour, images: [...e.target.files] });
  };

  // Funzione per mostrare gli alert
  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlertModal(true);
  };

  // Gestione della submit del nuovo tour
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in newTour) {
      if (key !== "images") {
        formData.append(key, newTour[key]);
      } else {
        newTour.images.forEach((image) => formData.append("images", image));
      }
    }

    try {
      const response = await fetch("http://localhost:8001/tours/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formData,
      });
      if (response.ok) {
        fetchTours();
        setShowModal(false);
        setNewTour({
          title: "",
          description: "",
          price: 0,
          region: "",
          location: "",
          tags: "",
          images: [],
        });
        showAlert("Tour added successfully!", "success");
      } else {
        showAlert("Failed to upload tour.", "danger");
      }
    } catch (error) {
      console.error("Error uploading tour:", error);
      showAlert("An error occurred while uploading the tour.", "danger");
    }
  };

  // Gestione della submit per l'editing di un tour
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in editTour) {
      if (key !== "images") {
        formData.append(key, editTour[key]);
      } else {
        editTour.images.forEach((image) => formData.append("images", image));
      }
    }

    try {
      const response = await fetch(
        `http://localhost:8001/tours/${editTour._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        fetchTours();
        setShowEditModal(false);
        showAlert("Tour updated successfully!", "success");
      } else {
        showAlert("Failed to update tour.", "danger");
      }
    } catch (error) {
      console.error("Error updating tour:", error);
      showAlert("An error occurred while updating the tour.", "danger");
    }
  };

  // Gestione della cancellazione di un tour
  const handleDeleteTour = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/tours/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (response.ok) {
        fetchTours();
        showAlert("Tour deleted successfully!", "success");
      } else {
        showAlert("Failed to delete tour.", "danger");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      showAlert("An error occurred while deleting the tour.", "danger");
    }
  };

  // Apertura del modal per l'editing di un tour
  const handleEditTour = (tour) => {
    setEditTour(tour);
    setShowEditModal(true);
  };

  // Gestione dell'azione di conferma
  const confirmActionHandler = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
  };

  // Rendering dei tour per regione
  const renderToursByRegion = (region) => {
    return tours
      .filter((tour) => tour.region.toLowerCase() === region.toLowerCase())
      .map((tour) => (
        <tr key={tour._id}>
          <td className="table-image">
            <img
              src={tour.images[0]}
              alt={tour.title}
              style={{ width: "100%", height: "100%" }}
            />
          </td>
          <td className="table-title">{tour.title}</td>
          <td className="table-description">{tour.description}</td>
          <td className="table-price">{tour.price}</td>
          <td className="table-location">{tour.location}</td>
          <td className="table-tags">{tour.tags.join(", ")}</td>
          <td className="table-actions">
            <Button variant="warning" onClick={() => handleEditTour(tour)}>
              <MdOutlineEdit />
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirmAction(() => () => handleDeleteTour(tour._id));
                setShowConfirmModal(true);
              }}
            >
              <MdOutlineDelete />
            </Button>
          </td>
        </tr>
      ));
  };

  return (
    <>
      <AppNavbar />
      <div className="admin-page">
        <div className="admin-content">
          <h2>Admin Page</h2>
          <Button onClick={() => setShowModal(true)}>
            <IoMdAdd />
            Add New
          </Button>
          <Tabs defaultActiveKey="central" className="mt-3">
            <Tab eventKey="central" title="Central">
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{renderToursByRegion("central")}</tbody>
              </Table>
            </Tab>
            <Tab eventKey="southern" title="Southern">
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{renderToursByRegion("southern")}</tbody>
              </Table>
            </Tab>
            <Tab eventKey="northern" title="Northern">
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{renderToursByRegion("northern")}</tbody>
              </Table>
            </Tab>
          </Tabs>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Tour</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit} className="add-new-tour-form">
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newTour.title}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={newTour.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={newTour.price}
                  onChange={handleInputChange}
                  required
                  min={0}
                />
              </Form.Group>
              <Form.Group controlId="region">
                <Form.Label>Region</Form.Label>
                <Form.Control
                  as="select"
                  name="region"
                  value={newTour.region}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Region</option>
                  <option value="Central">Central</option>
                  <option value="Southern">Southern</option>
                  <option value="Northern">Northern</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={newTour.location}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="tags">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={newTour.tags}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="images">
                <Form.Label>Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="center-button">
                Add Tour
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Tour</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editTour && (
              <Form onSubmit={handleEditSubmit} className="add-new-tour-form">
                <Form.Group controlId="editTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editTour.title}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="editDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editTour.description}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="editPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={editTour.price}
                    onChange={handleEditInputChange}
                    required
                    min={0}
                  />
                </Form.Group>
                <Form.Group controlId="editRegion">
                  <Form.Label>Region</Form.Label>
                  <Form.Control
                    as="select"
                    name="region"
                    value={editTour.region}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="">Select Region</option>
                    <option value="Central">Central</option>
                    <option value="Southern">Southern</option>
                    <option value="Northern">Northern</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="editLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={editTour.location}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="editTags">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={editTour.tags}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="editImages">
                  <Form.Label>Images</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleEditImageChange}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="center-button"
                >
                  Update Tour
                </Button>
              </Form>
            )}
          </Modal.Body>
        </Modal>
        <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {alertVariant === "success" ? "Success" : "Error"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{alertMessage}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAlertModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to proceed with this action?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmActionHandler}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default AdminPage;
