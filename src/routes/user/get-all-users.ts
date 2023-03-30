import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { HouseSeeker } from "../../models";

const router = Router()

router.get("/api/users", currentUser, requireAuth, async (req: Request, res: Response) => {

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


    const users = await HouseSeeker.paginate({

    }, options)



    res.status(200).send({ message: 'Users retrieved', users: users.itemsList, paginator: users.paginator })

})

export { router as getAllUsersRouter }