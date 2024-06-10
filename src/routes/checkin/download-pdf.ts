import { Request, Response, Router } from "express";
import path from "path";
import fs from 'fs'
import { BadRequestError, } from "../../errors";
import { RoommateAgreement } from "../../models/roommate-agreement";
import { query } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";

const router = Router();

router.get(
    "/api/checkin/download-agreement",
    currentUser,
    requireAuth,

    [
        query("roommates")
            .isArray({ min: 2 })
            .withMessage("Who and who are checkin in?"),
    ],
    validateRequest,

    async (req: Request, res: Response) => {
        const filePath = path.join(__dirname, '../../pdf', 'roommate-agreement.pdf');

        const roommate_agreement = await RoommateAgreement.findOne({
            roommates: req.query.roommates
        })

        if (!roommate_agreement) {
            throw new BadRequestError("Kindly pay the roommate agreement fee")
        }

        if (roommate_agreement.paid_by?.includes(req.currentUser!.id)) {
            if (!roommate_agreement.downloaded_by?.includes(req.currentUser!.id)) {
                await roommate_agreement.updateOne({
                    $push: { downloaded_by: req.currentUser!.id }
                })

            }

            return res.download(filePath, 'roommate-agreement.pdf', (err) => {
                if (err) {
                    console.log(err.message, "ERROR")
                }

            })
        } else {
            throw new BadRequestError("Please pay for and download the roommate agreement form")
        }




    }
);

export { router as downloadPDFRouter };
