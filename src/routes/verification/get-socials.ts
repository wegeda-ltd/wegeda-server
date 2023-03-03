import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { SocialMedia } from "../../models";

const router = Router()

router.get("/api/verification/get-socials/:user_id", currentUser, requireAuth, async (req: Request, res: Response) => {


    const socials = await SocialMedia.findOne({ user: req.params.user_id })

    if (!socials) {
        throw new NotFoundError("User's social media details not found")
    }


    res.status(200).send({ message: 'Social media details retrieved', socials })

})

export { router as getSocialMediaRouter }