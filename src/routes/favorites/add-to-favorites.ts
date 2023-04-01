import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, } from "../../middlewares";
import { Listing, Favorite, User } from "../../models";

const router = Router()

router.post("/api/favorites/:type/:id/add", currentUser, requireAuth, async (req: Request, res: Response) => {

    const type = req.params.type
    let listing!: any;
    let liked_user: any;
    if (type === "listing") {
        listing = await Listing.findById(req.params.id)
        if (!listing) {
            throw new NotFoundError("Listing not found")
        }

    } else {
        liked_user = await User.findById(req.params.id)
        if (!liked_user) {
            throw new NotFoundError("User not found")
        }
    }

    const newFavorite = Favorite.build({
        user: req.currentUser!.id,
        listing: listing!._id,
        listing_type: listing!.listing_type,
        liked_user: liked_user!.id
    })

    await newFavorite.save()
    res.status(200).send({ message: 'Added to favorite' })

})

export { router as addToFavoriteRouter }