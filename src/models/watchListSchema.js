import mongoose from "mongoose";

var Schema = mongoose.Schema;

export const watchLists = mongoose.model(
    'watchLists',
    new Schema(
        {
            userId: String,
            products: [
                {
                    productId: String
                }
            ]
        },
        {
            timestamps: true
        }
    ),
    'watchLists'    
);