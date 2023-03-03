import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, } from "../../middlewares";
import { Listing, Favorite } from "../../models";

const router = Router()

router.post("/api/favorites/:listing_id/add", currentUser, requireAuth, async (req: Request, res: Response) => {

    const listing = await Listing.findById(req.params.listing_id)

    if (!listing) {
        throw new NotFoundError("Listing not found")
    }
    const newFavorite = Favorite.build({
        user: req.currentUser!.id,
        listing: listing._id,
        listing_type: listing.listing_type
    })

    await newFavorite.save()
    res.status(200).send({ message: 'Added to favorite' })

})

export { router as addToFavoriteRouter }