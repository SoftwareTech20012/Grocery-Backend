import mongoose from "mongoose";

var Schema = mongoose.Schema;

export const OTP = mongoose.model(
    'OTP',
    new Schema(
        {
            phoneNumber: String,
            otp: Number,
            otpId: String
        },
        {
            timestamps: true
        }
    ),
    "OTP"
);