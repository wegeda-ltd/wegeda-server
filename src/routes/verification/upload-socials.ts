import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { SocialMedia, Verification } from "../../models";
import { VerificationStatus } from "../../types";

const router = Router()

router.post("/api/verification/upload-socials", currentUser, requireAuth, [
    body('social_media').isArray({ min: 1 }).withMessage('enter at least one social details'),


], validateRequest, async (req: Request, res: Response) => {
    let { social_media } = req.body

    const existingSocials = await SocialMedia.findOne({ user: req.params.user_id })

    if (existingSocials) {
        throw new BadRequestError("You have uploaded your social media details")
    }
    const socials = SocialMedia.build({
        user: req.currentUser!.id,
        social_media
    })

    await socials.save()

    const verification = await Verification.findOne({ user: req.currentUser!.id })

    if (!verification) {
        const newVerification = Verification.build({
            user: req.currentUser!.id,
            social_media_verified: VerificationStatus.Pending

        })

        await newVerification.save()
    } else {
        verification.set({
            social_media_verified: VerificationStatus.Pending

        })

        await verification.save()
    }
    res.status(200).send({ message: 'Social Media uploaded' })

})

export { router as uploadSocialsRouter }