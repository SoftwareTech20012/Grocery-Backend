import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const Recevier = mongoose.model(
    "recevierDetails",
    new Schema(
        {
            userId: String,
            userName: String,
            userNumber: Number,
            emailId: String,
            type: String,
            address: {
                doorNum: Number,
                street: String,
                district: String,
                pincode: Number,
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

export const User = mongoose.model(
    "User",
    new Schema(
        {
            userId: String,
            userName: String,
            userNumber: Number,
            emailId: String,
            address: {
                doorNum: Number,
                street: String,
                district: String,
                pincode: Number,
                state: String,
                country: String
            }
        },
        {
            timestamps: true
        }
    ),
    "User"
);