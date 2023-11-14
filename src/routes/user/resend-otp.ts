import { Request, Response, Router } from "express";
import { OtpClass, sendMail, sendSMS } from "../../services";

const router = Router();

router.post("/api/users/resend-otp", async (req: Request, res: Response) => {
  let { email, phone_number } = req.body;

  if (phone_number) {
    if (phone_number.length == 10)
      if (
        phone_number[0] == "8" ||
        phone_number[0] == "9" ||
        phone_number[0] == "7"
      ) {
        phone_number = "0" + phone_number;
      }
    // send otp to phone
    let phone_otp = await OtpClass.resendOtp({ phone_number });

    console.log(phone_otp);
    let message = `Your WEGEDA verification OTP is ${phone_otp} - sms`;
    await sendSMS({ message, phone_number });
    await sendMail({
      message,
      email,
      subject: `Your Verification OTP is ${phone_otp}`,
    });

    res.status(201).send({ message: "Otp sent to your phone, check sms" });
  } else {
    let email_otp = await OtpClass.resendOtp({ email });
    let message = `Your verification OTP is ${email_otp}`;

    await sendMail({
      message,
      email,
      subject: `Your Verification OTP is ${email_otp}`,
    });

    res.status(201).send({ message: "Otp sent to your sms and email" });
  }
});

export { router as resendOtpRouter };
