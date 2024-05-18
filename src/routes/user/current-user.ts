import { Router } from "express";
import { currentUser } from "../../middlewares";
import { HouseSeeker, Agent, Verification, User } from "../../models";
import { UserType } from "../../types";
import { CheckIn } from "../../models/checkin";

const router = Router();

router.get("/api/users/current-user", currentUser, async (req, res) => {

  if (req.currentUser) {
    const current_user = await User.findById(req.currentUser.id)
    let user: any;
    let verifications;
    const isCheckedIn = await CheckIn.findOne({
      roommates: req.currentUser!.id
    })

    if (req.currentUser.profile_type === UserType.HouseSeeker) {
      user = await HouseSeeker.findOne({ user: req.currentUser.id }).populate(
        "user"
      );

      verifications = await Verification.findOne({ user: req.currentUser.id });
    } else {
      user = await Agent.findOne({ user: req.currentUser.id }).populate("user");
    }

    if (req.currentUser?.profile_type === UserType.HouseSeeker) {

      current_user?.set({
        budget: user?.budget
      })


      await current_user?.save()

    }
    if (user?.profile_image && !current_user?.profile_image) {
      current_user?.set({
        profile_image: user?.profile_image
      })




      await current_user?.save()
    }


    const userReturned = user ? { ...user._doc, id: user._id, is_checked_in: isCheckedIn?.is_active || false } : { ...req.currentUser, is_checked_in: isCheckedIn?.is_active || false }

    res.send({ currentUser: userReturned, verifications });
  } else {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
