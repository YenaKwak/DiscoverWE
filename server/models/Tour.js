import mongoose from "mongoose";

// Definizione dello schema del tour
const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [{ type: String }],
    region: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
