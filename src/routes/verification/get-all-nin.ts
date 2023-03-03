import { Request, Response, Router } from "express";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Nin } from "../../models";

const router = Router()

router.get("/api/verification/get-all-nin", currentUser, requireAuth, async (req: Request, res: Response) => {


    const nin = await Nin.find()



    res.status(200).send({ message: 'Nin retrieved', nin })

})

export { router as getAllNinRouter }