import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/user/sentOTP', async (req, res) => {
    try {
        const key = process.env.TWO_FACTOR_KEY;
        const { phoneNumber } = req.body;
        if(!phoneNumber) {
            return res.status(400).json({ success: false, error: "Phone number required." });
        }

        let url = `https://2factor.in/API/V1/${key}/SMS/${phoneNumber}/AUTOGEN/:otp_template_name`;

        const response = await axios.get(url);

        if (response) {
            const responseData = response.data;
            return res.status(200).json({ success: true, otpSessionId: responseData.Details, message: "OTP sent successfully." });
        } else {
            return res.status(404).json({ success: false, error: "Faild to sent OPT." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error });
    }
});

router.post('/user/verifyOTP', async (req, res) => {
    try {
        const key = process.env.TWO_FACTOR_KEY;
        const { otpSessionId, otpEnteredByUser } = req.body;

        if (!otpSessionId || !otpEnteredByUser) {
            return res.status(400).json({ success: false, error: "OTP session Id and OTP entered by user are required." });
        }

        const url = `https://2factor.in/API/V1/${key}/SMS/VERIFY/${otpSessionId}/${otpEnteredByUser}`;
        console.log(url)
        const response = await axios.get(url);

        if (response) {
            return res.status(200).json({ success: true, data: response.data });
        } else {
            return res.status(400).json({ success: false, message: response.data });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;