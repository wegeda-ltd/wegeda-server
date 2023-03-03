import { Request, Response, Router } from "express";

import { currentUser, requireAuth, } from "../../middlewares";
import { AddressHistory } from "../../models";

const router = Router()

router.get("/api/verification/get-all-address/", currentUser, requireAuth, async (req: Request, res: Response) => {


    const address = await AddressHistory.find();



    res.status(200).send({ message: 'Address retrieved', address })

})

export { router as getAllAddressRouter }