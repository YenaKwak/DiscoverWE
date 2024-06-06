import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Funzione di registrazione
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" }); // Controlla se l'email esiste già
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Criptazione della password
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "50d" }
    ); // Generazione del token JWT
    res.status(201).json({ token }); // Risposta con il token
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// Funzione di login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" }); // Controlla se l'email esiste
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" }); // Verifica della password
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "50d" }
    ); // Generazione del token JWT
    res.status(200).json({ token }); // Risposta con il token
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

// Funzione per ottenere il profilo utente
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user); // Risposta con il profilo utente
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// Funzione per aggiornare il profilo utente
export const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const existingUser = await User.findOne({ name });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ message: "Name already exists" }); // Controlla se il nome esiste già
    }

    const user = await User.findById(req.user.id);
    user.name = name || user.name;
    await user.save();
    res.json(user); // Risposta con il profilo aggiornato
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile" });
  }
};

// Funzione di callback per Google OAuth
export const googleCallback = (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "50d" }
    ); // Generazione del token JWT
    res.redirect(`http://localhost:8000/google/callback?token=${token}`); // Reindirizzamento con il token
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
