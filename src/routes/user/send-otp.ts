import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { OtpClass, sendMail, sendSMS } from "../../services";

const router = Router()

router.post("/api/users/send-otp", [
    body('email').isEmail().withMessage('Email must be valid'),
    body('phone_number').trim().isLength({ min: 10 }).withMessage('phone number is a required field'),

], validateRequest, async (req: Request, res: Response) => {
    let { email, phone_number } = req.body

    if (phone_number && phone_number.length == 10) {
        if (phone_number[0] == '8' || phone_number[0] == '9' || phone_number[0] == '7') {
            phone_number = '0' + phone_number
        }

    }

    // send otp to phone
    let phone_otp = await OtpClass.generateOtp({ phone_number })

    let message = `Your verification OTP is ${phone_otp}`

    await sendSMS({ message, phone_number })

    let email_otp = await OtpClass.generateOtp({ email })
    message = `Your verification OTP is ${email_otp}`

    await sendMail({ message, email, subject: `Your Verification OTP is ${email_otp}` })

    res.status(200).send({ message: 'Otp sent to your sms and email' })

})

export { router as sendOtpRouter }