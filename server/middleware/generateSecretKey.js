import crypto from "crypto";

// Funzione per generare una chiave segreta casuale
const generateSecretKey = () => {
  return crypto.randomBytes(64).toString("hex"); // Genera 64 byte di valori casuali e li converte in una stringa esadecimale
};

console.log(generateSecretKey()); // Genera una chiave segreta e la stampa nella console

export default generateSecretKey;
