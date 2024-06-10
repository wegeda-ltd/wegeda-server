import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatGroup, ChatMessage, User, } from "../../models";
import { BadRequestError, ServerError } from "../../errors";
import { Payment } from "../../services";
import { RoommateAgreement } from "../../models/roommate-agreement";

const router = Router();

router.post(
    "/api/checkin/roommate-agreement",
    currentUser,
    requireAuth,
    [
        body("roommates")
            .isArray({ min: 2 })
            .withMessage("Who and who are checkin in?"),
        body("checkin_date").notEmpty().withMessage("Please enter your checkin date"),
        body("checkin_mode").notEmpty().withMessage("Please enter your checkin mode"),

        // body("reference").notEmpty().withMessage("Please enter your payment reference")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {
            roommates,
            reference,
            checkin_date,
            checkout_date,
            checkin_mode,
            listing,
        } = req.body;

        const existingAgreement = await RoommateAgreement.findOne({
            roommates: req.currentUser!.id,
            listing
        })


        let paymentVerified: any;

        if (reference) {
            paymentVerified = await new Payment().verifyPayment(reference)

            if (!paymentVerified.status) {
                throw new ServerError('Unable to verify payment')
            }


            if (existingAgreement) {
                await existingAgreement.updateOne({
                    $push: { paid_by: req.currentUser!.id, payment_refs: reference }
                })
            } else {
                const filteredRoommates: Set<string> = new Set(roommates)
                const roommies: string[] = Array.from(filteredRoommates)

                for (const user of roommies) {
                    const exists = await User.findById(user);

                    if (!exists) {
                        throw new BadRequestError("Some users do not exist");

                    }

                }



                const roommateAgreement = RoommateAgreement.build({
                    roommates: roommies,
                    payment_refs: [reference],
                    checkin_date,
                    checkin_mode,
                    checkout_date,
                    listing
                })

                await roommateAgreement.save()
            }

            return res.status(200).send({
                message: "Kindly download your agreement",

            })
        } else {
            if (!existingAgreement) {
                const filteredRoommates: Set<string> = new Set(roommates)
                const roommies: string[] = Array.from(filteredRoommates)

                for (const user of roommies) {
                    const exists = await User.findById(user);

                    if (!exists) {
                        throw new BadRequestError("Some users do not exist");

                    }

                }



                const roommateAgreement = RoommateAgreement.build({
                    roommates: roommies,
                    checkin_date,
                    checkin_mode,
                    checkout_date,
                    listing
                })

                await roommateAgreement.save()


            }

            return res.status(204).send({
                message: "You need to pay and download your roommate agreement\n\nBefore checking in",

            })
        }






    }
);

export { router as downloadRoommateAgreementRouter };
