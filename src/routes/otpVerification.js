import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { OTP } from '../models/OTPSchema.js';

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

router.post('/user/storeOTP', async (req, res) => {
    try {
        const { phoneNumber, enteredOTP } = req.body;
        const excistNumber = await OTP.findOne({ phoneNumber: phoneNumber });
        if (excistNumber) {
            const deleteExcistOtp = await OTP.findOneAndDelete({ phoneNumber: phoneNumber })
            .then(async () => {
                const otpId = uuidv4();
                const otpStructure = {
                    phoneNumber: phoneNumber,
                    otp: enteredOTP,
                    otpId: otpId
                };
                const storeOtp = await OTP.create(otpStructure);
                if (storeOtp) {
                    return res.status(200).json({ success: true, data: { OTP: enteredOTP, otpId: otpId }, message: "OTP generated successfully." });
                } else {
                    return res.status(400).json({ success: false, message: "Fail to generate OTP." });
                }
            })
            .catch((error) => {
                return res.status(400).json({ success: false, error: error.message });
            })
        } else {
            const otpId = uuidv4();
            const otpStructure = {
                phoneNumber: phoneNumber,
                otp: enteredOTP,
                otpId: otpId
            };
            const storeOtp = await OTP.create(otpStructure);
            if (storeOtp) {
                return res.status(200).json({ success: true, data: { OTP: enteredOTP, otpId: otpId }, message: "OTP generated successfully." });
            } else {
                return res.status(400).json({ success: false, message: "Fail to generate OTP." });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: true, error: error.message });
    }
});

router.post('/user/verifyGeneratedOTP', async (req, res) => {
    try {
        const { phoneNumber, enteredOTP, otpId } = req.body;
        const findOTP = await OTP.findOne({ phoneNumber: phoneNumber , otpId: otpId });
        if (!findOTP) {
            return res.status(400).json({ success: false, message: "There is no otp details for this number." });
        } else {
            if ( findOTP.otp === enteredOTP ) {
                return res.status(200).json({ success: true, message: "OTP matched." });
            } else {
                return res.status(400).json({ success: false, message: "OTP dismatched." });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;