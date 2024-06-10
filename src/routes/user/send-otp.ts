import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { OtpClass, sendMail, sendSMS } from "../../services";
import { BadRequestError } from "../../errors";
import { User } from "../../models";

const router = Router();

router.post(
  "/api/users/send-otp",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("phone_number")
      .trim()
      .isLength({ min: 10 })
      .withMessage("phone number is a required field"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { email, phone_number } = req.body;

    if (phone_number && phone_number.length == 10) {
      if (
        phone_number[0] == "8" ||
        phone_number[0] == "9" ||
        phone_number[0] == "7"
      ) {
        phone_number = "0" + phone_number;
      }
    }


    console.log(phone_number, "PHONE NUMBER", email)
    const userExist = await User.findOne({ phone_number, email });
    const userWithEmailExists = await User.findOne({ email });
    const userWithPhoneNumberExist = await User.findOne({ phone_number });

    if ((userWithEmailExists || userWithPhoneNumberExist) && !userExist) {
      throw new BadRequestError("Please enter a valid email/phone combination");
    }
    // send otp to phone
    let phone_otp = await OtpClass.generateOtp({ phone_number });

    let message = `Your WEGEDA verification OTP is ${phone_otp}`;


    await sendSMS({ message, phone_number });

    let email_otp = await OtpClass.generateOtp({ email });
    message = `Your verification OTP is ${email_otp}`;


    console.log(phone_otp, "PHONE \n", email_otp, "EMAIL");

    await sendMail({
      message: `Your SMS verification OTP is ${phone_otp}`,
      email,
      subject: `Your WEGEDA Verification OTP is ${phone_otp} - sms`,
    });
    await sendMail({
      message,
      email,
      subject: `Your WEGEDA Verification OTP is ${email_otp}`,
    });

    res.status(200).send({ message: "Otp sent to your sms and email" });
  }
);

export { router as sendOtpRouter };
