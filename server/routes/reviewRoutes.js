import express from "express";
import {
  createReview,
  getReviewsByTour,
  getReviewsByUser,
} from "../controllers/reviewController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

// Rotta per creare una recensione
reviewRouter.post("/", authenticateUser, createReview);

// Rotta per ottenere le recensioni di un tour specifico
reviewRouter.get("/tour/:tourId", getReviewsByTour);

// Rotta per ottenere le recensioni di un utente specifico
reviewRouter.get("/user/:userId", authenticateUser, getReviewsByUser);

export default reviewRouter;
