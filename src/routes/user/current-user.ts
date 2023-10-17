import { Router } from "express";
import { currentUser } from "../../middlewares";
import { HouseSeeker, Agent, Verification, User } from "../../models";
import { UserType } from "../../types";

const router = Router();

router.get("/api/users/current-user", currentUser, async (req, res) => {

  if (req.currentUser) {
    const current_user = await User.findById(req.currentUser.id)
    let user: any;
    let verifications;
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

      console.log(current_user, "CURRENT USER")

      await current_user?.save()

    }
    if (user?.profile_image && !current_user?.profile_image) {
      current_user?.set({
        profile_image: user?.profile_image
      })




      await current_user?.save()
    }
    res.send({ currentUser: user ? user : req.currentUser, verifications });
  } else {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
