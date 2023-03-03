import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError, NotFoundError } from "../../errors";
import { validateRequest } from "../../middlewares";
import { Notification, User } from "../../models";
import { OtpClass, sendMail, sendSMS } from "../../services";
import jwt from 'jsonwebtoken'
import { UserType } from "../../types";

const router = Router()

router.post("/api/users/verify-otp", [
    body('otp').trim().isLength({ min: 4 }).withMessage('enter the otp sent to you'),
    body('type').trim().notEmpty().withMessage('what are you verifying'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('phone_number').trim().isLength({ min: 10 }).withMessage('phone number is a required field'),
], validateRequest, async (req: Request, res: Response) => {
    let { email, phone_number, otp, type } = req.body



    if (phone_number && phone_number.length == 10) {
        if (phone_number[0] == '8' || phone_number[0] == '9' || phone_number[0] == '7') {
            phone_number = '0' + phone_number
        }

    }

    let verfied: boolean;

    if (type === "phone-number") {
        verfied = await OtpClass.verifyOtp({ phone_number, user_otp: otp })
    } else {
        verfied = await OtpClass.verifyOtp({ email, user_otp: otp })

    }

    if (!verfied) {
        throw new BadRequestError("Incorrect Otp")
    }


    let user = await User.findOne({ phone_number, email })

    let userJwt: string;
    if (!user) {
        let newUser = User.build({
            email,
            phone_number,
            profile_type: UserType.HouseSeeker,
            first_name: ".",
            last_name: "."
        })


        await newUser.save()
        let welcomeNotification = Notification.build({
            user: newUser._id,
            notification_image: "https://res.cloudinary.com/diils/image/upload/v1677772778/wegeda/logo_02_b7llt7.png",
            notification_message: "Welcome to Wegeda!"
        })
        await welcomeNotification.save()

        userJwt = jwt.sign({ id: newUser.id, email: newUser.email, phone_number: newUser.phone_number }, process.env.JWT_KEY!)

    }

    userJwt = jwt.sign({ id: user!.id, email: user!.email, phone_number: user!.phone_number }, process.env.JWT_KEY!)

    req.session = {
        jwt: userJwt
    }

    res.status(200).send({ message: 'Otp verification successful!' })


})

export { router as verifyOtpRouter }