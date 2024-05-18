import { Request, Response, Router } from "express";
import { body, check } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { User, } from "../../models";
import { BadRequestError, ServerError } from "../../errors";
import { RoommateAgreement } from "../../models/roommate-agreement";
import { CheckIn } from "../../models/checkin";

const router = Router();

router.post(
    "/api/checkin/",
    currentUser,
    requireAuth,
    [
        body("roommates")
            .isArray({ min: 1 })
            .withMessage("Who and who are checkin in?"),
        body("checkin_date").notEmpty().withMessage("Please enter your checkin date"),
        body("checkin_mode").notEmpty().withMessage("Please enter your checkin mode"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {
            roommates,
            checkin_date,
            checkout_date,
            checkin_mode,
            roommate_agreement
        } = req.body;


        for (const user of roommates) {
            const exists = await User.findById(user);

            if (!exists) {
                throw new BadRequestError("Some users do not exist");

            }

        }

        const checkedIn = await CheckIn.findOne({
            roommates: req.currentUser!.id
        })

        if (checkedIn?.is_active) {
            throw new BadRequestError("You have not yet checked out from your last apartment")
        }
        const checkin = CheckIn.build({
            roommates,
            checkin_date,
            checkout_date,
            checkin_mode,
            roommate_agreement,
        })


        await checkin.save()

        return res.send({
            message: "You have checked in...",

        })

    }
);

export { router as checkinRouter };
