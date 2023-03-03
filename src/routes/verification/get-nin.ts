import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Nin } from "../../models";

const router = Router()

router.get("/api/verification/get-nin/:user_id", currentUser, requireAuth, async (req: Request, res: Response) => {


    const nin = await Nin.findOne({ user: req.params.user_id })

    if (!nin) {
        throw new NotFoundError("User's nin not found")
    }


    res.status(200).send({ message: 'Nin retrieved', nin })

})

export { router as getNinRouter }