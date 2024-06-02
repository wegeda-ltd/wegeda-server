import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, } from "../../middlewares";
import { AddressHistory } from "../../models";

const router = Router()

router.get("/api/verification/get-address/:user_id",
    // currentUser, requireAuth, 
    async (req: Request, res: Response) => {


        const address = await AddressHistory.findOne({ user: req.params.user_id })

        if (!address) {
            throw new NotFoundError("User's address not found")
        }


        res.status(200).send({ message: 'Address history retrieved', address })

    })

export { router as getAddressHistoryRouter }