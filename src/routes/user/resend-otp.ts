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

    await sendMail({
      message: `
      <html>
        <body>
          <p>Hi</p>
          <p>Welcome to Wegeda! Use the OTP below to complete your signup</p>
          <br/>
          <p style="font-family:monospace"><b>${email_otp}</b></p>

          <br/>
          <p>This code is valid for <b>10 minutes</b>. Please don't share it with anyone.</p>

          <br/>
          

          <p>Need help? Contact us at <a href="mailto:hello@wegeda.com">hello@wegeda.com</a>

          <p>Thanks for choosing Wegeda!</p>
          <br/>

          <p>Best,</p>
          <p>The Wegeda Team</p>
        </body>
      </html>
      
      `,
      email,
      subject: `One-Time Password(OTP) For Your Account`,
    });


    res.status(201).send({ message: "Otp sent to your sms and email" });
  }
});

export { router as resendOtpRouter };
