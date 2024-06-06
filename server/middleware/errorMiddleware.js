// Middleware di gestione degli errori
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log della traccia dello stack dell'errore
  res.status(500).json({ message: "Internal server error" }); // Risposta con codice 500
};
