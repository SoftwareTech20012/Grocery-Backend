import express from 'express';
import { Recevier, User } from '../models/recevierSchema.js';
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
            return res.status(200).json({ success: true, message: "Recevier details stored successfully!" });
        } else {
            return res.status(404).json({ success: false, message: "Recevier details not stored" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/api/userRegister', async (req, res) => {
    try {
        const { userName, userNumber, emailId, doorNum, street, district, pincode, state, country } = req.body;

        const user = await User.find({},{__v: 0, _id: 0});
        console.log(user)
        const excistUser = user.map(((list => { list.emailId === emailId || list.userName === userName })));
        console.log(excistUser)
        if (excistUser) {
            return res.status(400).json({ success: false, error: "User already excist." });
        } else {
            console.log("namakkam")
            const userStructure = {
                userId: uuidv4(),
                userName: userName,
                userNumber: userNumber,
                emailId: emailId,
                address: {
                    doorNum: doorNum,
                    street: street,
                    district: district,
                    pincode: pincode,
                    state: state,
                    country: country
                }
            }
            const createUser = User.create(userStructure)
            .then(() => {
                return res.status(200).json({ success: true, message: "User created successfully." });
            })
            .catch((error) => {
                return res.status(404).json({ success: false, error: error.message });
            })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;

