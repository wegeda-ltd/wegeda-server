import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { OccupationParticular } from "../../models";

const router = Router()

router.get("/api/verification/get-occupation/:user_id",
    // currentUser, requireAuth,
    async (req: Request, res: Response) => {


        const occupation = await OccupationParticular.findOne({ user: req.params.user_id })

        if (!occupation) {
            throw new NotFoundError("User's occupation particulars not found")
        }


        res.status(200).send({ message: 'Occupation particulars retrieved', occupation })

    })

export { router as getOccupationParticularRouter }