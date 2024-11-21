import mongoose from "mongoose";
import recevierRoutes from '../routes/receiverRoutes.js';

var db = mongoose.connect("mongodb://localhost/SoftwareTech-Grocery");

export const initApiRoutes = (expressApp) => {
    //Recevier API'S
    expressApp.use(recevierRoutes);
}