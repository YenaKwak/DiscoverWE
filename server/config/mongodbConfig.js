import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Caricamento delle variabili d'ambiente dal file .env

// Funzione per la connessione a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🥰 Connesso a MongoDB Atlas!"); // Messaggio di successo
  } catch (error) {
    console.error("😱 Errore di connessione a MongoDB Atlas:", error);
    process.exit(1); // Uscita dal processo in caso di errore
  }
};

export default connectDB;
