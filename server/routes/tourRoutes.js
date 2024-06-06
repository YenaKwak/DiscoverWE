import express from "express";
import multer from "multer";
import {
  searchTours,
  createTour,
  getTours,
  getTourDetails,
  updateTour,
  deleteTour,
} from "../controllers/tourController.js";
import parser from "../config/multer.js";
import { authenticateAdmin } from "../middleware/adminMiddleware.js";

const tourRouter = express.Router();

// Middleware per gestire l'upload delle immagini
const handleUpload = (req, res, next) => {
  parser.array("images", 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Errore di Multer durante l'upload:", err);
      return res
        .status(500)
        .json({ message: "Errore di Multer durante l'upload." });
    } else if (err) {
      console.error("Errore sconosciuto durante l'upload:", err);
      return res
        .status(500)
        .json({ message: "Errore sconosciuto durante l'upload." });
    }
    next();
  });
};

// Rotta per creare un nuovo tour
tourRouter.post("/upload", authenticateAdmin, handleUpload, createTour);

// Rotta per ottenere tutti i tour
tourRouter.get("/", getTours);

// Rotta per ottenere i dettagli di un tour specifico
tourRouter.get("/:id", getTourDetails);

// Rotta per cercare tour
tourRouter.get("/search/tours", searchTours);

// Rotta per aggiornare un tour esistente
tourRouter.patch("/:id", authenticateAdmin, handleUpload, updateTour);

// Rotta per eliminare un tour esistente
tourRouter.delete("/:id", authenticateAdmin, deleteTour);

export default tourRouter;
