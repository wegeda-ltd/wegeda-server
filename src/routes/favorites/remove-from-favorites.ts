import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, } from "../../middlewares";
import { Favorite, Listing, User } from "../../models";

const router = Router()

router.patch("/api/favorites/:type/:id/remove", currentUser, requireAuth, async (req: Request, res: Response) => {
    const type = req.params.type

    if (type === "listing") {
        let favorite = await Listing.findById(req.params.id)
        if (!favorite) {
            throw new NotFoundError("Listing not found")
        }

        await favorite.updateOne({
            $pull: { favorites: req.currentUser!.id }
        })

    } else {
        let favorite = await User.findById(req.params.id)
        if (!favorite) {
            throw new NotFoundError("User not found")
        }

        await favorite.updateOne({
            $pull: { favorites: req.currentUser!.id }
        })
    }

    res.status(200).send({ message: 'Removed from favorite' })

})

export { router as removeFromFavoriteRouter }