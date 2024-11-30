import express from 'express';
import { addToCard } from '../models/productSchema.js';

const router = express.Router();

router.post('/product/addToCard', async (req, res) => {
    try {
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

router.post('/product/getAddToCardProducts', async (req, res) => {
    try {
        const { userId } = req.body;
        const getAddToCardProducts = await addToCard.findOne({ userId: userId },{ __v: 0, _id:0 });
        if(getAddToCardProducts){
            return res.status(200).json({ success: true, data: getAddToCardProducts });
        } else {
            return res.status(400).json({ success: false, error: "Can't able to find any products for this user.." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/product/updateAddToCardProducts', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const findUserData = await addToCard.findOne({ userId: userId });
        if (findUserData) {
            const isProductIn = findUserData.items.find( item => item.productId === productId );
            var orgQuantity;
            if (isProductIn) {
                if (isProductIn.quantity === quantity) {
                    orgQuantity = quantity;
                } else {
                    const findProductPrice = await products.findOne({ productId: productId });
                    const totalPrice = quantity * findProductPrice.finalPrice;
                    findUserData.totalPrice = totalPrice;
                    isProductIn.quantity = quantity;
                }
                await findUserData.save()
                .then(() => {
                    return res.status(200).json({ success: true, message: "Product data updated successfully.." });
                })
                .catch ((error) => {
                    res.status(400).json({ success: false, error: error.message });
                });
            } else {
                return res.status(400).json({ success: false, error: "There is no such product for this productId.." });
            }
        } else {
            return res.status(400).json({ success: false, error: "The user doesn't have any products in add to card." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/product/deleteAddToCardProducts', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const findUserData = await addToCard.findOne({ userId: userId });
        if (findUserData) {
            const filterProducts = findUserData.items.filter(item => item.productId !== productId );
            findUserData.items = filterProducts;
            const findtotalPrice = await Promise.all( filterProducts.map( async value => {
                const findProductPrice = await products.findOne({ productId: value.productId });
                return value.quantity * findProductPrice.finalPrice
            }))
            const totalPrice = findtotalPrice.reduce((acc, total) => acc + total, 0);
            findUserData.totalPrice = totalPrice;
            await findUserData.save()
            .then(() => {
                return res.status(200).json({ success: true, message: "Product successfully deleted from add to card." });
            })
            .catch((error) => {
                return res.status(400).json({ success: false, error: error.message });
            })
        } else {
            return res.status(400).json({ success: false, error: "Can't find any Add to card products for this user.." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;