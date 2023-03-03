import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Favorite } from "../../models";
import { UserType } from "../../types";

const router = Router()

router.get("/api/favorites/non-agent/", currentUser, requireAuth, async (req: Request, res: Response) => {

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
        populate: ["listing"]
    };


    const favorites = await Favorite.paginate({
        listing_type: UserType.HouseSeeker, user: req.currentUser!.id
    }, options)



    res.status(200).send({ message: 'Listings retrieved', favorites: favorites.itemsList, paginator: favorites.paginator })

})

export { router as getNonAgentFavoritesRouter }