import express from 'express';
import { Recevier } from '../models/recevierSchema.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post("/api/userLogin", async (req, res) => {
    try {
        const { userName, userNumber, doorNum, address, nearByLandmark } = req.body;
        const { street, district, state, country } = address;
        const recevierStructure = {
            userId: uuidv4(),
            userName: userName,
            userNumber: userNumber,
            address: {
                doorNum: doorNum,
                street: street,
                district: district,
                state: state,
                country: country
            },
            nearByLandmark: nearByLandmark
        };
        const createRecevierDetails = Recevier.create(recevierStructure);
        if (createRecevierDetails) {
            return res.status(200).json({ success: true, message: "Recevier details collected successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Recevier details not collected" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;

