import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { TfiCommentsSmiley } from "react-icons/tfi";
import "../../styles/SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Gestisce la ricerca
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) {
      setShowModal(true);
    } else {
      navigate(`/search?query=${query}`);
    }
  };

  // Gestisce la chiusura del modal
  const handleClose = () => setShowModal(false);

  return (
    <div className="search-bar">
      <Form onSubmit={handleSearch} style={{ display: "flex", width: "100%" }}>
        <Form.Control
          type="text"
          placeholder="Interesting activities"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mr-2"
          style={{ flex: 1, marginRight: "10px" }}
        />
        <Button
          variant="outline-primary"
          type="submit"
          style={{ borderRadius: "50%" }}
        >
          <IoSearch />
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Enter what you want to search for <TfiCommentsSmiley />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SearchBar;
