import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing } from "../../models";

const router = Router()

router.get("/api/listings/user/standbys", currentUser, requireAuth, async (req: Request, res: Response) => {

    const listings = await Listing.find({
        on_stand_by: req.currentUser!.id
    }).populate('user')

    res.status(200).send({ message: 'Standbys retrieved', listings })

})

export { router as getUserStandbyRouter }