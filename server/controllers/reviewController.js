import Review from "../models/Review.js";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";

// Creazione di una nuova recensione
export const createReview = async (req, res) => {
  try {
    const { tour, rating, comment } = req.body;
    const newReview = new Review({
      tour,
      rating,
      comment,
      user: req.user.id,
    });
    await newReview.save();

    // Aggiunta della recensione al documento del tour
    await Tour.findByIdAndUpdate(
      tour,
      { $push: { reviews: newReview._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Error creating review", error });
  }
};

// Recupero delle recensioni per un tour specifico
export const getReviewsByTour = async (req, res) => {
  try {
    const reviews = await Review.find({ tour: req.params.tourId })
      .populate("user", "name")
      .lean();

    const updatedReviews = await Promise.all(
      reviews.map(async (review) => {
        // Trovare la prenotazione utilizzando l'utente e il tour della recensione
        const booking = await Booking.findOne({
          user: review.user._id, // ID dell'utente che ha scritto la recensione
          tour: req.params.tourId, // ID del tour
        }).lean();

        return {
          ...review,
          user: review.user.name.split(" ")[0], // Restituisce solo la prima parte del nome dell'utente
          bookingDate: booking
            ? booking.bookingDate.toISOString().split("T")[0]
            : "No booking date",
        };
      })
    );

    res.status(200).json(updatedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Recupero delle recensioni per un utente specifico
export const getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate("tour")
      .exec();

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};
