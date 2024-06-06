import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

// Configurazione della strategia Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8001/auth/google/callback", // URL di callback
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Cerca o crea un utente utilizzando il profilo Google
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Se l'utente non esiste, creane uno nuovo
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: "user",
          });
          await user.save(); // Salva il nuovo utente
        }
        return done(null, user); // Passa le informazioni dell'utente
      } catch (error) {
        return done(error, null); // Gestione degli errori
      }
    }
  )
);

// Configurazione della serializzazione dell'utente
passport.serializeUser((user, done) => {
  done(null, user.id); // Serializza l'ID dell'utente
});

// Configurazione della deserializzazione dell'utente
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Trova l'utente per ID
    done(null, user); // Passa le informazioni dell'utente
  } catch (error) {
    done(error, null); // Gestione degli errori
  }
});

export default passport;
