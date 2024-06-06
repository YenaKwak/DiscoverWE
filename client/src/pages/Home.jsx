import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar from "../components/common/Navbar";
import CarouselComponent from "../components/common/CarouselComponent";
import Footer from "../components/common/Footer";
import RegionSection from "./RegionSection";

const Home = () => {
  return (
    <div>
      <AppNavbar />
      <CarouselComponent />
      <RegionSection />
      <Footer />
    </div>
  );
};

export default Home;
