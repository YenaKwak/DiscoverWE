import express from "express";
import { login as adminLogin } from "../controllers/adminController.js";
import { authenticateAdmin } from "../middleware/adminMiddleware.js";

const adminRouter = express.Router();

// Rotta per il login dell'amministratore
adminRouter.post("/login", adminLogin);

// Rotta per il logout dell'amministratore
adminRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Rotta per la dashboard dell'amministratore con controllo di autenticazione
adminRouter.get("/dashboard", authenticateAdmin, (req, res) => {
  res.send("Admin Dashboard");
});

export default adminRouter;
