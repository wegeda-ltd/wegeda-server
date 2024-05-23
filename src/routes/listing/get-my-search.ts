import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { MySearch } from "../../models";

const router = Router();


router.get(
    "/api/listings/search/",
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {
        const mySearch = await MySearch.findOne({
            user: req.currentUser?.id
        })

        res.status(200).send({
            message: "Most recent search retrieved",
            mySearch,
        });
    }
);

export { router as getMySearchRouter };
