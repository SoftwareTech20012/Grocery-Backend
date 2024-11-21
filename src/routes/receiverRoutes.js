import express from 'express';
import { Recevier } from '../models/recevierSchema';

const router = express.Router();

router.post("/api/userLogin", async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;

