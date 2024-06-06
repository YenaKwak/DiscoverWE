import express from "express";
import passport from "passport";
import {
  register,
  login,
  googleCallback,
} from "../controllers/authController.js";

const authRouter = express.Router();

// Rotta per l'autenticazione con Google
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Rotta di callback per l'autenticazione con Google
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

// Rotta per la registrazione degli utenti
authRouter.post("/signup", register);

// Rotta per il login degli utenti
authRouter.post("/login", login);

// Rotta per il logout degli utenti
authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default authRouter;
