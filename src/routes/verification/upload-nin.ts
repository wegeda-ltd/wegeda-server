import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Nin, Verification } from "../../models";
import { VerificationStatus } from "../../types";

const router = Router()

router.post("/api/verification/upload-nin", currentUser, requireAuth, [
    body('nin').notEmpty().withMessage('what is your nin?'),

], validateRequest, async (req: Request, res: Response) => {
    let { nin } = req.body

    const existingNin = await Nin.findOne({ user: req.params.user_id })

    if (existingNin) {
        throw new BadRequestError("You have uploaded your nin")
    }
    const newNin = Nin.build({
        user: req.currentUser!.id,
        nin
    })

    await newNin.save()
    const verification = await Verification.findOne({ user: req.currentUser!.id })

    if (!verification) {
        const newVerification = Verification.build({
            user: req.currentUser!.id,
            nin_verified: VerificationStatus.Pending

        })

        await newVerification.save()
    } else {
        verification.set({
            nin_verified: VerificationStatus.Pending
        })
        await verification.save()
    }
    res.status(200).send({ message: 'Nin uploaded' })

})

export { router as uploadNinRouter }