import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Verification } from "../../models";

const router = Router()

router.patch("/api/verification/verify-income/:user_id", currentUser, requireAuth, [
    body('income_verified').notEmpty().withMessage('please verify the financial statements'),

], validateRequest, async (req: Request, res: Response) => {


    const { income_verified } = req.body

    const verification = await Verification.findOne({ user: req.params.user_id })

    if (!verification) {
        throw new NotFoundError("User hasn't started the process")
    }

    verification.set({
        income_verified
    })

    await verification.save()

    res.status(200).send({ message: 'Income verified', verification })

})

export { router as verifyIncomeRouter }