import express from 'express';
import { products } from '../models/productSchema.js';
import { addToCard } from '../models/productSchema.js';
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

router.post('/product/addToCard', async (req, res) => {
    try {
        const data = req.body;
        const { userId, productId, quantity } = req.body;
        const checkUserId = await addToCard.findOne({ userId: userId });

        if (checkUserId) {
            const itemExcist = checkUserId.items.find(item => item.productId === productId );
            if (itemExcist) {
                itemExcist.quantity += quantity || 1;
            } else {
                const itemStructure = {
                    productId: productId,
                    quantity: quantity
                };
                checkUserId.items.push(itemStructure);
                var finalPrice = await products.findOne({ productId: productId });
            }
            const findtotalPrice = await Promise.all(checkUserId.items.map( async value => {
                const findProductPrice =await products.findOne({ productId: value.productId });
                return value.quantity * findProductPrice.finalPrice 
            }));
            const addExtraPrice = await finalPrice ? findtotalPrice.push(finalPrice.finalPrice) : findtotalPrice;
            const totalPrice = findtotalPrice.reduce((acc, total) => acc + total, 0);
            checkUserId.totalPrice = totalPrice;
            await checkUserId.save()
            .then(() => {
                return res.status(200).json({ success: true, message: "Item added to the add to card successfully.." });
            })
            .catch ((error) => {
                return res.status(400).json({ success: false, error: error.message });
            })
        } else {
            const findProductData = await products.findOne({ productId: productId });
            const totalPrice = findProductData.finalPrice * quantity;
            const addToCardStructure = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: quantity
                }],
                totalPrice: totalPrice
            }
            const addItem = await addToCard.create(addToCardStructure)
            .then(() => {
                return res.status(200).json({ success: true, message: "Item added successfully to card successfully.." });
            })
            .catch((error) => {
                return res.status(400).json({ success: false, error: error.message });
            })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;