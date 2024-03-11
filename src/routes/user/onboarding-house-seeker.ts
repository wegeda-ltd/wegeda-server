import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Agent, HouseSeeker, User } from "../../models";
import jwt from "jsonwebtoken";
import { UserType } from "../../types";
import { BadRequestError } from "../../errors";

const router = Router();

router.post(
  "/api/users/onboarding-house-seeker",
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
    body("date_of_birth")
      .trim()
      .notEmpty()
      .withMessage("what is your date of birth"),
    body("gender").trim().notEmpty().withMessage("what gender are you?"),
    body("occupation").trim().notEmpty().withMessage("what do you do?"),
    body("descriptions")
      .isArray({ min: 1 })
      .withMessage("how do you describe yourself?"),
    body("interests")
      .isArray({ min: 1 })
      .withMessage("please choose at least one interest"),
    body("smokes").trim().notEmpty().withMessage("do you smoke?"),
    body("drinks").trim().notEmpty().withMessage("do you take alcohol?"),
    body("about").trim().notEmpty().withMessage("tell us a little about you"),
    body("cleans_room")
      .trim()
      .notEmpty()
      .withMessage("how often do you clean your room?"),
    body("cooks")
      .trim()
      .notEmpty()
      .withMessage("how often do you clean your room?"),
    body("partying")
      .trim()
      .notEmpty()
      .withMessage("how often do you clean your room?"),
    body("religion")
      .trim()
      .notEmpty()
      .withMessage("how often do you clean your room?"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let {
      first_name,
      last_name,
      date_of_birth,
      gender,
      occupation,
      descriptions,
      interests,
      smokes,
      drinks,
      about,
      cleans_room,
      gallery_images,
      company,
      pets,
      church,
      orientation_camp,
      profile_image,
      cooks,
      partying,
      religion,
      tertiary_institution,
    } = req.body;

    const current_user = await User.findById(req.currentUser?.id);

    if (!current_user) {
      return;
    }

    const isAgent = await Agent.findOne({
      user: current_user.id,
    });

    if (isAgent) {
      throw new BadRequestError(
        "This account is already signed up as an Agent"
      );
    }
    current_user.set({
      first_name,
      last_name,
      profile_type: UserType.HouseSeeker,
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

    const existing_house_seeker = await HouseSeeker.findOne({
      user: current_user.id,
    });

    if (existing_house_seeker) {
      throw new BadRequestError("User is already onboarded!");
    }
    const house_seeker = HouseSeeker.build({
      user: current_user.id,
      date_of_birth,
      about,
      gender,
      occupation,
      description: descriptions,
      interests,
      smokes,
      drinks,
      cleans_room,
      profile_image: profile_image
        ? profile_image
        : gender === "female"
          ? "https://res.cloudinary.com/diils/image/upload/v1677774464/wegeda/user_female_umai03.png"
          : "https://res.cloudinary.com/diils/image/upload/v1677774465/wegeda/user_male_wpb9rn.png",
      gallery_images,
      company,
      pets,
      church,
      orientation_camp,
      religion,
      partying,
      cooks,
      budget: [0, 0],
      tertiary_institution,
    });

    await house_seeker.save();
    res.status(200).send({
      message: "Congratulations on successfully completing your profile",
      token: userJwt,
    });
  }
);

export { router as onboardingHouseSeekerRouter };
