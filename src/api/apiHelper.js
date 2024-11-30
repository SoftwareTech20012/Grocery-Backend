import mongoose from "mongoose";
import recevierRoutes from '../routes/receiverRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import addToCardProductsRoutes from '../routes/addToCardProducts.js';

var db = mongoose.connect("mongodb://localhost/SoftwareTech-Grocery");

export const initApiRoutes = (expressApp) => {
    //Recevier API'S
    expressApp.use(recevierRoutes);
    //Product API's
    expressApp.use(productRoutes);
    //Add to card API's
    expressApp.use(addToCardProductsRoutes);
}