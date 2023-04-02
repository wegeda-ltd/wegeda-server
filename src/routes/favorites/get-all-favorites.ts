import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Favorite } from "../../models";
import { UserType } from "../../types";

const router = Router()

router.get("/api/favorites/", currentUser, requireAuth, async (req: Request, res: Response) => {

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
        populate: ["favorite"]
    };


    const favorites = await Favorite.paginate({
    }, options)



    res.status(200).send({ message: 'Listings retrieved', favorites: favorites.itemsList, paginator: favorites.paginator })

})

export { router as getAllFavoritesRouter }