import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing } from "../../models";

const router = Router()

router.get("/api/listings/:listing_id", currentUser, requireAuth, async (req: Request, res: Response) => {

    const listing = await Listing.findById(req.params.listing_id)
    if (!listing) {
        throw new NotFoundError("Listing not found")
    }

    res.status(200).send({ message: 'Listings retrieved', listing })

})

export { router as getListingByIdRouter }