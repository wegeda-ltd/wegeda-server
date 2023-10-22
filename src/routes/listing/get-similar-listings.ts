import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing } from "../../models";

const router = Router()

router.get("/api/listings/:listing_id/similar", currentUser, requireAuth, async (req: Request, res: Response) => {


    const listing = await Listing.findById(req.params.listing_id).select("monthly_payment")
    if (!listing) {
        throw new NotFoundError("Listing not found")
    }


    const monthly_payment = listing.monthly_payment


    const similarListings = await Listing.find({
        $and: [
            {
                monthly_payment: {
                    $lte: monthly_payment * (1.8),
                    $gte: monthly_payment * (0.8),
                }
            },
            {
                _id: { $ne: listing.id }
            }
        ]

    }).limit(10)

    res.status(200).send({ message: 'Similar listings retrieved', similarListings })

})

export { router as getSimilarListingsRouter }