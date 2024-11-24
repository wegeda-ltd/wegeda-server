import { Router } from "express";
import { Agent, HouseSeeker, Listing, User, UserSubscription } from "../../models";
import { BadRequestError, NotFoundError } from "../../errors";
import { OtpClass, sendMail } from "../../services";

const router = Router();

router.delete("/api/users", async (req, res) => {

    const { otp, id } = req.query

    const user = await User.findById(id);
    if (!user) {
        throw new NotFoundError("User not found")
    }

    console.log(otp, id, "OTP AND ID")

    console.log(user, "USER FOUND")
    const otpVerified = await OtpClass.verifyOtp({ email: user.email, user_otp: otp })

    console.log(otpVerified, "OTP VERIFIED")

    if (!otpVerified) {
        throw new BadRequestError("Invalid/Expired Otp");
    }

    await Listing.deleteMany({
        user
    })
    await UserSubscription.deleteMany({
        user
    })
    await Agent.deleteOne({
        user
    })

    await HouseSeeker.deleteOne({
        user
    })
    await user.delete()

    res.status(200).send({ message: "Account deleted" })


})



router.post("/api/users/initiate-deletion", async (req, res) => {

    const { email } = req.body;
    if (!email) {
        throw new BadRequestError("Email is required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new NotFoundError("User not found")
    }


    const otp = await OtpClass.generateOtp({ email })

    const link = `http://localhost:3000/delete-account/?id=${user.id}&code=${otp}`
    let message = `
    <p>You requested to delete your account</p><br/>
    <br/>
    <a href=${link}
    style="width: fit-content; text-decoration: none; background-color:#CF0058;padding:10px 15px;border-radius: 5px; font-size: 13px; display:flex; align-items:center; justify-content:center; color:#fff">Click
    here to delete your account</a>
  <br/>
  <br/>
    <p>This link expires in 10 minutes</p>
       <p>Kindly ignore if this wasn't initiated by you</p>
 
    `

    await sendMail({
        message,
        email,
        subject: `Request to delete your wegeda account`,
    });

    res.status(200).send({ message: "Account deletion link sent to your email" })
})
export { router as deleteUserRouter }