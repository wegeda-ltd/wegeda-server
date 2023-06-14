import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Agent, HouseSeeker, User } from "../../models";
import { UserType } from "../../types";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../errors";

const router = Router();

router.post(
  "/api/users/onboarding-agent",
  currentUser,
  requireAuth,
  [
    body("first_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("first name is a required field"),
    body("last_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("last name is a required field"),
    body("license_id")
      .isArray({ min: 1 })
      .withMessage("upload your license id"),
    body("agent_type")
      .trim()
      .notEmpty()
      .withMessage("please select agent type"),
    body("about_organization")
      .trim()
      .notEmpty()
      .withMessage("tell us about your organization"),
    body("organization_name")
      .trim()
      .notEmpty()
      .withMessage("what is your organization name?"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let {
      first_name,
      last_name,
      license_id,
      agent_type,
      about_organization,
      organization_name,
    } = req.body;

    const current_user = await User.findById(req.currentUser?.id);

    if (!current_user) {
      return;
    }

    const isHouseSeeker = await HouseSeeker.find({
      user: current_user.id,
    });

    if (isHouseSeeker) {
      throw new BadRequestError(
        "This account is already signed up as a House Seeker"
      );
    }
    current_user.set({
      first_name,
      last_name,
      profile_type: UserType.Agent,
    });

    await current_user.save();

    let userJwt = jwt.sign(
      {
        id: current_user!._id,
        email: current_user!.email,
        phone_number: current_user!.phone_number,
        profile_type: current_user!.profile_type,
      },
      process.env.JWT_KEY!
    );

    // req.session = {
    //     jwt: userJwt
    // }

    const existing_agent = await Agent.findOne({ user: current_user.id });
    if (existing_agent) {
      throw new BadRequestError("User is already onboarded!");
    }

    const agent = Agent.build({
      user: current_user.id,
      agent_type,
      profile_image:
        "https://res.cloudinary.com/diils/image/upload/v1677774465/wegeda/user_male_wpb9rn.png",
      organization_name,
      about_organization,
      license_id,
    });

    await agent.save();

    res.status(200).send({
      message: "Congratulations on successfully completing your profile",
      token: userJwt,
    });
  }
);

export { router as onboardingAgentRouter };
