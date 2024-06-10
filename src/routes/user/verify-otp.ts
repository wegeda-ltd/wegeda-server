import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError, NotFoundError } from "../../errors";
import { validateRequest } from "../../middlewares";
import { Agent, HouseSeeker, Notification, User, Verification } from "../../models";
import { OtpClass, sendMail, sendSMS } from "../../services";
import jwt from "jsonwebtoken";
import { UserType } from "../../types";

const router = Router();

router.post(
  "/api/users/verify-otp",
  [
    body("otp")
      .trim()
      .isLength({ min: 4 })
      .withMessage("enter the otp sent to you"),
    body("type").trim().notEmpty().withMessage("what are you verifying"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("phone_number")
      .trim()
      .isLength({ min: 10 })
      .withMessage("phone number is a required field"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { email, phone_number, otp, type } = req.body;

    if (phone_number && phone_number.length == 10) {
      if (
        phone_number[0] == "8" ||
        phone_number[0] == "9" ||
        phone_number[0] == "7"
      ) {
        phone_number = "0" + phone_number;
      }
    }

    let verfied: boolean;

    if (type === "phone-number") {
      verfied = await OtpClass.verifyOtp({ phone_number, user_otp: otp });
    } else {
      verfied = await OtpClass.verifyOtp({ email, user_otp: otp });
    }

    if (!verfied) {
      throw new BadRequestError("Incorrect Otp");
    }

    const userExist = await User.findOne({ phone_number, email });
    const userWithEmailExists = await User.findOne({ email });
    const userWithPhoneNumberExist = await User.findOne({ phone_number });

    if ((userWithEmailExists || userWithPhoneNumberExist) && !userExist) {
      throw new BadRequestError("Please enter a valid email/phone combination");
    }

    let userJwt: string;
    if (!userExist) {
      let newUser = User.build({
        email,
        phone_number,
        profile_type: UserType.HouseSeeker,
        first_name: ".",
        last_name: ".",
      });

      await newUser.save();
      let welcomeNotification = Notification.build({
        user: newUser._id,
        notification_image:
          "https://res.cloudinary.com/diils/image/upload/v1677772778/wegeda/logo_02_b7llt7.png",
        notification_message: "Welcome to Wegeda!",
      });
      await welcomeNotification.save();

      userJwt = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          phone_number: newUser.phone_number,
        },
        process.env.JWT_KEY!
      );

      return res
        .status(200)
        .send({ message: "Otp verification successful!", token: userJwt });
    } else {
      userJwt = jwt.sign(
        {
          id: userExist!.id,
          email: userExist!.email,
          phone_number: userExist!.phone_number,
          profile_type: userExist!.profile_type,
        },
        process.env.JWT_KEY!
      );


      // POPULATE CURRENT USER
      const current_user = await User.findById(userExist.id)
      let user;
      let verifications;
      if (userExist.profile_type === UserType.HouseSeeker) {
        user = await HouseSeeker.findOne({ user: userExist.id }).populate(
          "user"
        );
        verifications = await Verification.findOne({ user: userExist.id });
      } else {
        user = await Agent.findOne({ user: userExist.id }).populate("user");
      }

      if (user?.profile_image && !current_user?.profile_image) {
        current_user?.set({
          profile_image: user?.profile_image,
          status: 'online'
        })

        await current_user?.save()
      }
      return res
        .status(200)
        .send({ message: "Otp verification successful!", token: userJwt, user });
    }
  }
);

export { router as verifyOtpRouter };
