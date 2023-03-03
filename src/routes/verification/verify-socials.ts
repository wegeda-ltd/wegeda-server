import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Verification } from "../../models";

const router = Router()

router.patch("/api/verification/verify-socials/:user_id", currentUser, requireAuth, [
    body('social_media_verified').notEmpty().withMessage('please verify the social media'),

], validateRequest, async (req: Request, res: Response) => {


    const { social_media_verified } = req.body

    const verification = await Verification.findOne({ user: req.params.user_id })

    if (!verification) {
        throw new NotFoundError("User hasn't started the process")
    }

    verification.set({
        social_media_verified
    })

    await verification.save()

    res.status(200).send({ message: 'Social media verified', verification })

})

export { router as verifySocialsRouter }