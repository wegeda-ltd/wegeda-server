import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { OccupationParticular, Verification } from "../../models";

const router = Router()

router.post("/api/verification/upload-occupation", currentUser, requireAuth, [
    body('occupation_particulars').isArray({ min: 1 }).withMessage('upload your occupation_particulars'),

], validateRequest, async (req: Request, res: Response) => {
    let { occupation_particulars } = req.body

    const existingOccupation = await OccupationParticular.findOne({ user: req.params.user_id })

    if (existingOccupation) {
        throw new BadRequestError("You have uploaded your financial statements")
    }
    const occupation = OccupationParticular.build({
        user: req.currentUser!.id,
        occupation_particulars
    })

    await occupation.save()
    const verification = await Verification.findOne({ user: req.params.user_id })

    if (!verification) {
        const newVerification = Verification.build({
            user: req.currentUser!.id,

        })

        await newVerification.save()
    }

    res.status(200).send({ message: 'Occupation particulars uploaded' })

})

export { router as uploadOccupationParticularRouter }