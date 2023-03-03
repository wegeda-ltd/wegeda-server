import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, } from "../../middlewares";
import { Favorite } from "../../models";

const router = Router()

router.delete("/api/favorites/:listing_id/remove", currentUser, requireAuth, async (req: Request, res: Response) => {

    const favorites = await Favorite.findOne({ listing: req.params.listing_id, user: req.currentUser!.id })

    if (!favorites) {
        throw new NotFoundError("Listing not found in favorites")
    }

    await favorites.delete()

    res.status(200).send({ message: 'Removed from favorite' })

})

export { router as removeFromFavoriteRouter }