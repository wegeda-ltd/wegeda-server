import { Request, Response, Router } from "express";

import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { SocialMedia } from "../../models";

const router = Router()

router.get("/api/verification/get-all-socials/", currentUser, requireAuth, async (req: Request, res: Response) => {


    const socials = await SocialMedia.find()



    res.status(200).send({ message: 'Social media details retrieved', socials })

})

export { router as getAllSocialMediaRouter }