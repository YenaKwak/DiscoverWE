import jwt from "jsonwebtoken";

// Middleware di autenticazione amministratore
export const authenticateAdmin = (req, res, next) => {
  // Estrazione del token dall'intestazione Authorization o dal localStorage
  const token =
    req.header("Authorization")?.split(" ")[1] ||
    localStorage.getItem("adminToken");

  // Se il token non è presente, restituisce un errore 401
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  try {
    // Verifica del token JWT
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Controlla se il ruolo dell'utente è "admin"
    if (decodedToken.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Aggiunta delle informazioni dell'utente alla richiesta
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
