import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Verification } from "../../models";

const router = Router()

router.patch("/api/verification/verify-address/:user_id", currentUser, requireAuth, [
    body('address_history_verified').notEmpty().withMessage('please verify the address history'),

], validateRequest, async (req: Request, res: Response) => {


    const { address_history_verified } = req.body

    const verification = await Verification.findOne({ user: req.params.user_id })

    if (!verification) {
        throw new NotFoundError("User hasn't started the process")
    }

    verification.set({
        address_history_verified
    })

    await verification.save()

    res.status(200).send({ message: 'Address history verified', verification })

})

export { router as verifyAddressHistoryRouter }