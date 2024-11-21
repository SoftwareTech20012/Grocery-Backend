import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const Recevier = mongoose.model(
    "recevierDetails",
    new Schema(
        {
            userId: String,
            userName: String,
            userNumber: Number,
            type: String,
            address: {
                doorNum: Number,
                Street: String,
                district: String,
                state: String,
                country: String
            },
            nearByLandmark: String
        },
        {
            timestamps: true
        }
    ),
    "recevierDetails"
);