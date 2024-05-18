import { Request, Response, Router } from "express";
import { body, check } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { User, } from "../../models";
import { BadRequestError, ServerError } from "../../errors";
import { RoommateAgreement } from "../../models/roommate-agreement";
import { CheckIn } from "../../models/checkin";

const router = Router();

router.post(
    "/api/checkout/",
    currentUser,
    requireAuth,
    [
        body("address").notEmpty().withMessage("Please enter your new address"),
        body("moving_to").notEmpty().withMessage("Please enter where you are moving to"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {
            address,
            moving_to
        } = req.body;



        const checkedIn = await CheckIn.findOne({
            roommates: req.currentUser!.id
        })

        if (!checkedIn?.is_active) {
            throw new BadRequestError("You have not checked in to any apartment")
        }

        checkedIn.set({
            is_active: false,
            address,
            moving_to,
            checkout_date: new Date()
        })


        await checkedIn.save()

        return res.send({
            message: "You have checked out...",

        })

    }
);

export { router as checkoutRouter };
