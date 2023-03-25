import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { FinancialStatement, Verification } from "../../models";
import { VerificationStatus } from "../../types";

const router = Router()

router.post("/api/verification/upload-financials", currentUser, requireAuth, [
    body('financial_statements').isArray({ min: 1 }).withMessage('upload your financial statement'),

], validateRequest, async (req: Request, res: Response) => {
    let { financial_statements } = req.body

    const existingFinancials = await FinancialStatement.findOne({ user: req.params.user_id })

    if (existingFinancials) {
        throw new BadRequestError("You have uploaded your financial statements")
    }
    const financials = FinancialStatement.build({
        user: req.currentUser!.id,
        financial_statements
    })

    await financials.save()
    const verification = await Verification.findOne({ user: req.currentUser!.id })


    if (!verification) {
        const newVerification = Verification.build({
            user: req.currentUser!.id,
            income_verified: VerificationStatus.Pending
        })

        await newVerification.save()
    } else {
        verification.set({
            income_verified: VerificationStatus.Pending
        })
        await verification.save()
    }
    res.status(200).send({ message: 'Financial statement uploaded' })

})

export { router as uploadFinancialStatementRouter }