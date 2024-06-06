import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Funzione di login per l'amministratore
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "admin" }); // Trova l'utente con il ruolo "admin"
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" }); // Controlla se l'utente esiste
    }
    const isPasswordValid = await bcrypt.compare(password, user.password); // Verifica della password
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" }); // Verifica se la password è valida
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    ); // Generazione del token JWT
    res.status(200).json({ token }); // Risposta con il token
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};
