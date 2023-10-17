import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing } from "../../models";

const router = Router()

router.get("/api/listings/:listing_id/standby", currentUser, requireAuth, async (req: Request, res: Response) => {

    const listing = await Listing.findById(req.params.listing_id).select("on_stand_by listing_title").populate("on_stand_by")
    if (!listing) {
        throw new NotFoundError("Listing not found")
    }

    res.status(200).send({ message: 'Standbys retrieved', listing })

})

export { router as getListingStandbyRouter }