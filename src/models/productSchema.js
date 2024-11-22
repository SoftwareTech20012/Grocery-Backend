import mongoose from "mongoose";

var Schema = mongoose.Schema;

export const products = mongoose.model(
    "productDetails",
    new Schema(
        {
            productId: String,
            name: String,
            category: String,
            actualPrice: Number,
            discount: Number,
            unit: [String],
            quantity: Number,
            brand: String,
            addedDate: Date,
            productDetails: String,
            keyFeatures: [String],
            isAvailable: Boolean,
            finalPrice: Number,
            images: [String],
            tags: [String],
            nutritionalInfo: Object,
            supplier: {
                supplierName: String,
                contact: Number,
                address: String
            },
            reviews: [{
                comment: String,
                reviewImg: [String],
                rating: Number,
                dateOfReview: Date
            }],
            overAllRating: Number
        }
    )
);