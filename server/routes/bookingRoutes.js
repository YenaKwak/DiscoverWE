import express from "express";
import {
  createBooking,
  getBookingByUser,
  checkBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

// Rotta per creare una prenotazione
bookingRouter.post("/", authenticateUser, createBooking);

// Rotta per verificare la disponibilità di una prenotazione
bookingRouter.post("/check", authenticateUser, checkBooking);

// Rotta per ottenere le prenotazioni di un utente specifico
bookingRouter.get("/:userId", authenticateUser, getBookingByUser);

// Rotta per verificare una prenotazione specifica di un utente per un tour
bookingRouter.get("/user/:userId/tour/:tourId", authenticateUser, checkBooking);

// Rotta per annullare una prenotazione
bookingRouter.delete("/:id", authenticateUser, cancelBooking);

export default bookingRouter;
