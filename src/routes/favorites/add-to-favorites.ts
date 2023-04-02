import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, } from "../../middlewares";
import { Listing, Favorite, User, HouseSeeker } from "../../models";
import { FavoriteType } from "../../types";

const router = Router()

router.patch("/api/favorites/:type/:id/add", currentUser, requireAuth, async (req: Request, res: Response) => {


    const type = req.params.type

    if (type === "listing") {
        let favorite = await Listing.findById(req.params.id)
        if (!favorite) {
            throw new NotFoundError("Listing not found")
        }

        await favorite.updateOne({
            $push: { favorites: req.currentUser!.id }
        })

    } else {
        let favorite = await HouseSeeker.findOne({ user: req.params.id })
        if (!favorite) {
            throw new NotFoundError("User not found")
        }

        await favorite.updateOne({
            $push: { favorites: req.currentUser!.id }
        })
    }



    // const newFavorite = Favorite.build({
    //     user: req.currentUser!.id,
    //     favorite_type: type === "listing" ? FavoriteType.Listing : FavoriteType.User,
    //     favorite_room,
    //     favorite_roommate

    // })

    // await newFavorite.save()
    res.status(200).send({ message: 'Added to favorite' })

})

export { router as addToFavoriteRouter }