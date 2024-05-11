import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { AddressHistory, Verification } from "../../models";
import { VerificationStatus } from "../../types";

const router = Router()

router.post("/api/verification/upload-address", currentUser, requireAuth, [
    body('prev_address_line1').notEmpty().withMessage('enter your previous address'),
    body('prev_lga').notEmpty().withMessage('enter your previous address local government'),
    body('prev_state').notEmpty().withMessage('enter your previous address state'),
    body('prev_landlord_name').notEmpty().withMessage("enter your previous landlord's name"),
    body('prev_landlord_phone_number').notEmpty().withMessage("enter your previous landlord's phone number"),
    body('problems_with_prev_landlord').notEmpty().withMessage('did you have problems with your previous landlord?'),

    body('address_line1').notEmpty().withMessage('enter your address'),
    body('lga').notEmpty().withMessage('enter your  local government'),
    body('state').notEmpty().withMessage("enter your state"),
    body('landlord_name').notEmpty().withMessage("enter your landlord's name"),
    body('landlord_phone_number').notEmpty().withMessage("enter your landlord's phone number"),
    body('problems_with_landlord').notEmpty().withMessage('do you have problems with your landlord?'),

], validateRequest, async (req: Request, res: Response) => {
    let {
        prev_address_line1,
        prev_address_line2,
        prev_lga, prev_state,
        prev_landlord_name,
        prev_landlord_phone_number,
        problems_with_prev_landlord,
        prev_country,
        prev_postal_code,

        address_line1,
        address_line2,
        lga,
        state,
        landlord_name,
        landlord_phone_number,
        problems_with_landlord,
        postal_code,
        country
    } = req.body

    const existingAddress = await AddressHistory.findOne({ user: req.params.user_id })

    if (existingAddress) {
        throw new BadRequestError("You have uploaded your address history")
    }


    const address = AddressHistory.build({
        prev_address: {
            address_line1: prev_address_line1,
            address_line2: prev_address_line2,
            lga: prev_lga,
            state: prev_state,
            country: prev_country ? prev_country : "Nigeria",
            postal_code: prev_postal_code,
            landlord_name: prev_landlord_name,
            landlord_phone_number: `0${prev_landlord_phone_number}`,
            problems_with_landlord: problems_with_prev_landlord
        },
        user: req.currentUser!.id,
        current_address: {
            address_line1,
            address_line2,
            lga,
            state,
            country: country ? country : "Nigeria",
            postal_code: postal_code,
            landlord_name,
            landlord_phone_number: `0${landlord_phone_number}`,
            problems_with_landlord
        },
    })

    await address.save()
    const verification = await Verification.findOne({ user: req.currentUser!.id })

    if (!verification) {
        const newVerification = Verification.build({
            user: req.currentUser!.id,
            address_history_verified: VerificationStatus.Pending
        })

        await newVerification.save()
    } else {
        verification.set({
            address_history_verified: VerificationStatus.Pending
        })
        await verification.save()
    }

    res.status(200).send({ message: 'Address history uploaded' })

})

export { router as uploadAddressHistoryRouter }