import mongoose from "mongoose";
import { TReview } from '../types/review.type';
const ReviewSchema = new mongoose.Schema<TReview>(
  {
    rating: {
      type: Number,
      required: [true, "Please enter a rating"],
      min: [1, "rating must be between 1 and 5"],
      max: [5, "rating must be between 1 and 5"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please enter a review title"],
      maxLength: [100, "review title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please enter a review title"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;