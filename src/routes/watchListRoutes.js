import express from 'express';
import { watchLists } from '../models/watchListSchema.js';

const router = express.Router();

router.post('/product/addWatchList', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const checkUser = await watchLists.findOne({ userId: userId });
        if (checkUser) {
            const excistProduct = await checkUser.products.find(list => list.productId === productId);
            if (excistProduct) {
                return res.status(400).json({ success: false, message: "Already you has this product in your watchList." });
            } else {
                const producttStructure = {
                    productId: productId
                }
                checkUser.products.push(producttStructure);
            }
            await checkUser.save()
            .then(() => {
                return res.status(200).json({ success: true, message: "Product added into watchlist successfully." });
            })
            .catch((error) => {
                return res.status(404).json({ success: false, error: error.message }); 
            })
        } else {
            const watchListStructure = {
                userId: userId,
                products: [
                    {
                        productId: productId
                    }
                ]
            };
            await watchLists.create(watchListStructure)
            .then(() => {
                return res.status(200).json({ success: true, message: "Product added to watchlist successfully." });
            })
            .catch((error) => {
                return res.status(404).json({ success: false, error: error.message }); 
            })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/product/getWatchlistProducts', async (req, res) => {
    try {
        const { userId } = req.body;
        const checkUser = await watchLists.findOne({ userId: userId });
        if (checkUser) {
            const getAddToCardProducts = checkUser.products.map(list => {
                return list.productId;
            })
            if (getAddToCardProducts) {
                return res.status(200).json({ success: true, data: getAddToCardProducts });
            } else {
                return res.status(404).json({ success: false, error: "Can't able to get any products from watchlist." });
            }
        } else {
            return res.status(404).json({ success: false, error: "This user hasn't any products in watchlist." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/product/updateWatchlistProducts', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const checkUser = await watchLists.findOne({ userId: userId });
        if (checkUser) {
            const excistProduct = checkUser.products.find(list => list.productId === productId );
            if (excistProduct) {
                return res.status(400).json({ success: false, error: "This product was already in your watchlist." });
            } else {
                checkUser.products.push({productId: productId})
                await checkUser.save()
                .then(() =>{
                    return res.status(200).json({ success: true, message: "Product updated successfully." });
                })
                .catch((error) => {
                    return res.status(404).json({ success: false, error: error.message });
                })
            }
        } else {
            return res.status(400).json({ success: false, error: "This user has no products in watchlist." });l
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/product/deleteWatchlistProducts', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const checkUser = await watchLists.findOne({ userId: userId });
        if (checkUser) {
            const excistProduct = checkUser.products.find(list => list.productId === productId );
            if (excistProduct) {
                const filterProducts = checkUser.products.filter(list => {
                    return list.productId !== productId;
                });
                checkUser.products = filterProducts;
                await checkUser.save()
                .then(() =>{
                    return res.status(200).json({ success: true, message: "Product removed successfully." });
                })
                .catch((error) => {
                    return res.status(404).json({ success: false, error: error.message });
                })
            } else {
                return res.status(400).json({ success: false, error: "No product found." });
            }
        } else {
            return res.status(400).json({ success: false, error: "This user has no products in watchlist." });l
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
})

export default router;