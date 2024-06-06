import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

// Funzione per ottenere tutti i tour
export const getTours = async (req, res) => {
  try {
    const { region, query, minPrice, maxPrice, reviews, location } = req.query;
    const filters = {};

    if (region) filters.region = new RegExp(region, "i");
    if (query) {
      filters.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }
    if (minPrice) filters.price = { $gte: Number(minPrice) };
    if (maxPrice) {
      filters.price = filters.price || {};
      filters.price.$lte = Number(maxPrice);
    }
    if (location) filters.location = new RegExp(location, "i");

    let tours = await Tour.find(filters).populate("reviews").lean();
    tours = await processTourReviews(tours);

    // Filtraggio delle recensioni
    if (reviews) {
      const reviewRatings = reviews.split(",").map(Number);
      tours = tours.filter((tour) =>
        reviewRatings.includes(Math.round(tour.rating))
      );
    }

    res.status(200).json(tours);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante il recupero dei tour", error });
  }
};

// Funzione per ottenere i dettagli di un tour specifico
export const getTourDetails = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).lean();
    if (!tour) {
      return res.status(404).json({ message: "Tour non trovato" });
    }
    const reviews = await Review.find({ tour: tour._id }).lean();
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const rating = reviews.length > 0 ? totalRating / reviews.length : 0;
    res
      .status(200)
      .json({ ...tour, reviews, rating: parseFloat(rating.toFixed(2)) });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Errore durante il recupero dei dettagli del tour",
        error,
      });
  }
};

// Funzione per creare un nuovo tour
export const createTour = async (req, res) => {
  try {
    const { title, description, price, region, tags, location } = req.body;

    if (!title || !description || !price || !region || !tags || !location) {
      return res
        .status(400)
        .json({ message: "Tutti i campi sono obbligatori" });
    }

    const images = req.files.map((file) => file.path);
    const newTour = new Tour({
      title,
      description,
      price,
      images,
      region,
      tags: tags.split(",").map((tag) => tag.trim()),
      location,
    });
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante la creazione del tour", error });
  }
};

// Funzione per cercare tour
export const searchTours = async (req, res) => {
  try {
    const {
      region,
      query,
      minPrice,
      maxPrice,
      reviews,
      location,
      recommended,
    } = req.query;
    const filters = {};

    if (region) filters.region = new RegExp(region, "i");
    if (query) {
      filters.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }
    if (minPrice) filters.price = { $gte: Number(minPrice) };
    if (maxPrice) {
      filters.price = filters.price || {};
      filters.price.$lte = Number(maxPrice);
    }
    if (location) filters.location = new RegExp(location, "i");
    if (recommended) filters.recommended = recommended === "true";

    let tours = await Tour.find(filters).populate("reviews").lean();

    const toursWithReviews = await processTourReviews(tours);

    if (reviews) {
      const reviewArray = reviews.split(",").map(Number);
      tours = toursWithReviews.filter((tour) =>
        reviewArray.includes(Math.round(tour.rating))
      );
    } else {
      tours = toursWithReviews;
    }

    res.status(200).json(tours);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante la ricerca dei tour", error });
  }
};

// Funzione per aggiornare un tour
export const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, region, tags, location } = req.body;

    if (!title || !description || !price || !region || !tags || !location) {
      return res
        .status(400)
        .json({ message: "Tutti i campi sono obbligatori" });
    }

    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour non trovato" });
    }

    tour.title = title;
    tour.description = description;
    tour.price = price;
    tour.region = region;
    tour.tags = tags.split(",").map((tag) => tag.trim());
    tour.location = location;

    if (req.files && req.files.length > 0) {
      tour.images = req.files.map((file) => file.path);
    }

    await tour.save();
    res.status(200).json(tour);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento del tour", error });
  }
};

// Funzione per elaborare le recensioni dei tour
const processTourReviews = async (tours) => {
  return await Promise.all(
    tours.map(async (tour) => {
      const reviews = await Review.find({ tour: tour._id }).lean();
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const rating = reviews.length > 0 ? totalRating / reviews.length : 0;
      return { ...tour, reviews, rating: parseFloat(rating.toFixed(2)) };
    })
  );
};

// Funzione per eliminare un tour
export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour non trovato" });
    }
    await Tour.findByIdAndDelete(id);
    res.status(200).json({ message: "Tour eliminato con successo" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante l'eliminazione del tour", error });
  }
};
