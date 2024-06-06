// CarouselComponent.jsx
// src/components/CarouselComponent.jsx
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import "../../styles/CarouselComponent.css";

const carouselItems = [
  {
    src: `${process.env.PUBLIC_URL}/assets/carousel/carousel_toscana.jpg`,
    alt: "toscana",
  },
  {
    src: `${process.env.PUBLIC_URL}/assets/carousel/carousel_venezia.jpg`,
    alt: "venezia",
  },
  {
    src: `${process.env.PUBLIC_URL}/assets/carousel/carousel_firenze.jpg`,
    alt: "firenze",
  },
];

const CarouselComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gestisce la selezione dell'indice corrente del carosello
  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-inner">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${
              index === currentIndex ? "active" : ""
            }`}
          >
            <img
              className="d-block w-100 carousel-image"
              src={item.src}
              alt={item.alt}
            />
          </div>
        ))}
      </div>
      <div className="carousel-caption-overlay">
        <div className="carousel-caption-text">
          <h1>YOUR ITALIAN DELIGHT</h1>
          <p>Find the activity you want.</p>
          <div className="search-bar-wrapper">
            <SearchBar />
          </div>
        </div>
      </div>
      <div className="carousel-indicators-wrapper">
        <div className="carousel-indicators">
          {carouselItems.map((item, index) => (
            <button
              key={index}
              className={index === currentIndex ? "active" : ""}
              onClick={() => handleSelect(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselComponent;
