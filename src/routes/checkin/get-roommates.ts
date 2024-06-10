import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatGroup, ChatMessage, User, } from "../../models";
import { BadRequestError, ServerError } from "../../errors";
import { Payment } from "../../services";
import { RoommateAgreement } from "../../models/roommate-agreement";
import { CheckIn } from "../../models/checkin";

const router = Router();

router.get(
    "/api/checkin/roommates",
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {



        const hasPaid = await RoommateAgreement.findOne({
            roommates: req.currentUser!.id,
            listing: req.query.listing_id
        }).populate('roommates downloaded_by')

        const checkedIn = await CheckIn.findOne({
            roommates: req.currentUser!.id
        })

        // if (!hasPaid) {
        //     throw new BadRequestError("Please pay for the roommate agreement");
        // }
        // if (checkedIn && checkedIn.is_active) {
        //     throw new BadRequestError("You have checked in already");

        // }


        return res.send({
            message: "Roommates retrieved",
            roommates: hasPaid

        })

    }
);

export { router as getRoommatesRouter };
