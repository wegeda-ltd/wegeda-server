import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing } from "../../models";
import { UserType } from "../../types";

const router = Router()

router.get("/api/listings/agent-listings/", currentUser, requireAuth, async (req: Request, res: Response) => {

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
        listing_type: UserType.Agent
    }, options)



    res.status(200).send({ message: 'Listings retrieved', listings: listings.itemsList, paginator: listings.paginator })

})

export { router as getAllAgentListingRouter }