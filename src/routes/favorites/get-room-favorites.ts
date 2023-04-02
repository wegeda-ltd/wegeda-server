import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Favorite, Listing } from "../../models";
import { FavoriteType, UserType } from "../../types";

const router = Router()

router.get("/api/favorites/room/", currentUser, requireAuth, async (req: Request, res: Response) => {

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
    };



    const favorites = await Listing.paginate({
        favorites: req.currentUser!.id
    }, options)


    res.status(200).send({ message: 'Listings retrieved', favorites: favorites.itemsList, paginator: favorites.paginator })

})

export { router as getRoomFavoritesRouter }