import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodbConfig.js";
import passport from "./config/passportConfig.js";
import session from "express-session";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Caricamento delle variabili di ambiente
dotenv.config();

// Creazione dell'applicazione Express
const app = express();

// Configurazione di CORS
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);

// Middleware per il parsing del JSON e dei dati URLencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurazione della sessione
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware per il logging delle richieste
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Inizializzazione di Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Connessione al database
connectDB();

// Definizione delle rotte
app.use("/tours", tourRouter);
app.use("/users", userRouter);
app.use("/reviews", reviewRouter);
app.use("/bookings", bookingRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

// Middleware per la gestione degli errori
app.use(errorHandler);

// Avvio del server
const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`🌟 Server listening on port ${port}`);
});
