import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing } from "../../models";

const router = Router()

router.get("/api/listings/user/:user_id", currentUser, requireAuth, async (req: Request, res: Response) => {

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


    const listings = await Listing.paginate({
        user: req.params.user_id
    }, options)



    res.status(200).send({ message: 'Listings retrieved', listings: listings.itemsList, paginator: listings.paginator })

})

export { router as getUserListingRouter }