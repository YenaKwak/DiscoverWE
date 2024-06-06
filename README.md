# DiscoverWE - Epicode's Capstone Project

DiscoverWE è un'applicazione web che aiuta gli utenti a esplorare diverse regioni d'Italia e prenotare attività.

## Descrizione del progetto

DiscoverWE è un'applicazione web che permette di cercare e prenotare attività interessanti in diverse regioni d'Italia. Questo progetto offre agli utenti la possibilità di registrarsi, gestire il proprio profilo e le prenotazioni e scrivere recensioni. Gli amministratori possono aggiungere e gestire nuovi tour.

### Avviso Importante

Questo è un progetto personale del bootcamp. Non inserire informazioni personali e non utilizzarlo per scopi reali.<br>
This is a personal project for a bootcamp. Do not enter personal information and do not use it for real purposes.

## Funzioni principali

- Registrazione e accesso dell'utente (incluso Google OAuth)
- Ricerca e filtro dei tour
- Prenotazione dei tour
- Gestione del profilo utente e delle prenotazioni effettuate
- Scrittura e visualizzazione delle recensioni
- Gestione dei tour nella pagina dell'amministratore

## Strumenti e pacchetti

### Backend

- bcrypt
- cloudinary
- cors
- dotenv
- express
- express-session
- jsonwebtoken
- jwt-decode
- mongoose
- multer
- multer-storage-cloudinary
- passport
- passport-google-oauth20
- passport-jwt

### Frontend

- @fortawesome/fontawesome-svg-core
- @fortawesome/free-brands-svg-icons
- @fortawesome/free-solid-svg-icons
- @fortawesome/react-fontawesome
- @testing-library/jest-dom
- @testing-library/react
- @testing-library/user-event
- bootstrap
- date-fns
- jwt-decode
- react
- react-bootstrap
- react-bootstrap-range-slider
- react-datepicker
- react-dom
- react-icons
- react-range
- react-router-dom
- react-scripts
- web-vitals

## Installazione ed esecuzione

### Requisiti

- Node.js (v14 o successiva)
- Account e database MongoDB Atlas

### Clona e installa

```bash
git clone https://github.com/YenaKwak/DiscoverWE.git
cd DiscoverWE
```

### Installazione del back-end

```bash
cd server
npm install
```

### Installazione del front-end

```bash
cd client
npm install
```

### Impostazione delle variabili d'ambiente

Crea un file `.env` nella directory root del tuo progetto e imposta le seguenti variabili di ambiente:

```env
# MongoDB
MONGO_URL=<L'URL del tuo MongoDB Atlas>

# JWT
JWT_SECRET=<Il tuo segreto JWT>

# Google OAuth
GOOGLE_CLIENT_ID=<Il tuo ID cliente Google>
GOOGLE_CLIENT_SECRET=<Il tuo segreto cliente Google>

# Cloudinary
CLOUDINARY_NAME=<Il tuo nome Cloudinary>
CLOUDINARY_API_KEY=<La tua chiave API Cloudinary>
CLOUDINARY_API_SECRET=<Il tuo segreto API Cloudinary>

# Sessione
SESSION_SECRET=<Il tuo segreto di sessione>
```

### Esecuzione del server

#### Esecuzione del back-end

```bash
cd server
npm run dev
```

#### Esecuzione del front-end

```bash
cd client
npm start
```

## Immagini

Le immagini utilizzate in questo progetto sono state prese da Unsplash.
