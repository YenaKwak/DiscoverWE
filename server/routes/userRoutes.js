import express from "express";
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Route per la registrazione degli utenti
userRouter.post("/register", register);

// Route per il login degli utenti
userRouter.post("/login", login);

// Route per ottenere il profilo dell'utente autenticato
userRouter.get("/profile", authenticateUser, getUserProfile);

// Route per aggiornare il profilo dell'utente autenticato
userRouter.put("/profile", authenticateUser, updateUserProfile);

export default userRouter;
