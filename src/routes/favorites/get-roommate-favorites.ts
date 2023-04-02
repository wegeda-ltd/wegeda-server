import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Favorite, HouseSeeker, User } from "../../models";
import { FavoriteType, UserType } from "../../types";

const router = Router()

router.get("/api/favorites/roommates/", currentUser, requireAuth, async (req: Request, res: Response) => {

    const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        pagingCounter: 'slNo',
        meta: 'paginator',
    };

    const options = {
        page: 1,
        limit: 10,
        customLabels: myCustomLabels,
        populate: ["user"]
    };


    const favorites = await HouseSeeker.paginate({
        favorites: req.currentUser!.id
    }, options)



    res.status(200).send({ message: 'Favorites retrieved', favorites: favorites.itemsList, paginator: favorites.paginator })

})

export { router as getRoommateFavoritesRouter }