import express from 'express';
import { products } from '../models/productSchema.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/product/addProducts', async (req, res) => {
    try {
        const productDetails = req.body;
        const { actualPrice, discount } = req.body;
        const finalPrice = (actualPrice/100) * discount;
        productDetails["finalPrice"] = actualPrice - finalPrice;
        productDetails["overAllRating"] = 0;
        productDetails["reviews"] = [];
        const productId = uuidv4();
        productDetails["productId"] = productId;
        
        const createProduct = await products.create(productDetails)
        .then(() => {
            return res.status(200).json({ success: true, message: "Product details added successfully..!!" });
        })
        .catch((e) => {
            return res.status(404).json({ success: false, message: "Product detail not added.", error: e.message})
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/product/searchProduct', async (req, res) => {
    try {
        const { tags } = req.body;
        const findProduct = await products.findOne({  tags:tags }, { _id:0, __v:0 })
        if (findProduct) {
            return res.status(200).json({ success: true, data: findProduct })
        } else {
            return res.status(500).json({ success: false, message: "cann't find" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/product/getAllProducts', async (req, res) => {
    try {
        const getAllProducts = await products.find({},{ __v: 0, _id: 0 });
        if (getAllProducts) {
            return res.status(200).json({ success: true, data: getAllProducts })
        } else {
            return res.status(400).json({ success: false, message: "Cann't able to find items." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/product/getProduct', async (req, res) => {
    try {
        const details = req.body;
        const findProduct = await products.find( details ,{ __v: 0, _id: 0 });
        if (findProduct) {
            return res.status(200).json({ success: true, data: findProduct })
        } else {
            return res.status(404).json({ success: false, error: "Cann't able to find items."})
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/product/updateProduct', async (req, res) => {
    try {
        const updateDetails = req.body;
        const updateProductDetails = await products.updateOne({ productId: updateDetails.productId }, { $set: updateDetails });
        if (updateProductDetails) {
            return res.status(200).json({ success: true, message: "Product detail updated successfully.." });
        } else {
            return res.status(400).json({ success: false, error: "Product detail not updated.." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/product/deleteProduct', async (req, res) => {
    try {
        const { productId } = req.body;
        const deleteProduct = await products.deleteOne({ productId: productId });
        if (deleteProduct) {
            return res.status(200).json({ success: true, message: "Product deleted succssfully.." });
        } else {
            return res.status(400).json({ success: false, error: "Product not deleted.." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;