import jwt from "jsonwebtoken";

// Middleware di autenticazione utente
export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Estrazione del token dall'intestazione Authorization
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica del token JWT
    req.user = decoded; // Aggiunta delle informazioni dell'utente alla richiesta
    console.log("Authenticated user:", req.user); // Log dell'utente autenticato
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
