import Booking from "../models/Booking.js";
import jwt from "jsonwebtoken";

// Funzione per verificare la disponibilità della prenotazione
export const checkBookingAvailability = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Estrazione del token dall'intestazione Authorization
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verifica del token JWT
    const userId = decodedToken.id;

    const { tourId } = req.body;
    const existingBooking = await Booking.findOne({
      user: userId,
      tour: tourId,
      status: "reserved",
    });
    if (existingBooking) {
      return res.status(400).json({ message: "You've already booked this." }); // Risposta se la prenotazione esiste già
    }

    res.status(200).json({ message: "Booking available" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while checking availability.",
      error,
    });
  }
};

// Funzione per creare una prenotazione
export const createBooking = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    const { tour, bookingDate, people, price } = req.body;
    const existingBooking = await Booking.findOne({
      user: userId,
      tour,
      status: "reserved",
    });
    if (existingBooking) {
      return res.status(400).json({ message: "You've already booked this." });
    }

    const newBooking = new Booking({
      user: userId,
      tour,
      bookingDate,
      people,
      price,
    });
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the reservation.",
      error,
    });
  }
};

// Funzione per annullare una prenotazione
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Your booking has been cancelled" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while canceling your booking.",
      error,
    });
  }
};

// Funzione per recuperare le prenotazioni di un utente
export const getBookingByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate(
      "tour"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status500().json({
      message: "An error occurred while viewing your booking.",
      error,
    });
  }
};

// Funzione per verificare lo stato della prenotazione di un tour
export const checkBooking = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const { tourId } = req.body;
    const existingBooking = await Booking.findOne({
      user: userId,
      tour: tourId,
      status: "reserved",
    });

    if (existingBooking) {
      return res.status(200).json({ isBooked: true });
    } else {
      return res.status(200).json({ isBooked: false });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while checking your booking status.",
      error,
    });
  }
};
