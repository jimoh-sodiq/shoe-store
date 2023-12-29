import mongoose from "mongoose";
import { TProduct } from "../types/product.type";

const ProductSchema = new mongoose.Schema<TProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxLength: [1000, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      default: 0,
    },
    images: {
      type: [String],
      required: [true, "Product image is required"],
      default: [],
      minlength: [4, "A minimum of 4 Product images is required"],
    },
    category: {
      type: String,
      required: [true, "Please provide  product category"],
      enum: ["men", "women", "kids", "unisex"],
    },
    brand: {
      type: String,
      required: [true, "Please provide  brand name"],
    },
    colors: {
      type: [String],
      required: [true, "Please provide color"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 1,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


ProductSchema.pre("deleteOne", async function(){
  console.log("Deleted this product")
})

const Product = mongoose.model("Product", ProductSchema);

export default Product;
