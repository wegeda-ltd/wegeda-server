import { Request, Response, Router } from "express";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { OccupationParticular } from "../../models";

const router = Router()

router.get("/api/verification/get-all-occupation/", currentUser, requireAuth, async (req: Request, res: Response) => {


    const occupation = await OccupationParticular.find()



    res.status(200).send({ message: 'Occupation particulars retrieved', occupation })

})

export { router as getAllOccupationParticularRouter }