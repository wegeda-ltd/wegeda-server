import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { FinancialStatement } from "../../models";

const router = Router()

router.get("/api/verification/get-financials/:user_id",
    // currentUser, requireAuth, 
    async (req: Request, res: Response) => {


        const financials = await FinancialStatement.findOne({ user: req.params.user_id })

        if (!financials) {
            throw new NotFoundError("User's financial statements not found")
        }


        res.status(200).send({ message: 'Financial statement retrieved', financials })

    })

export { router as getFinancialStatementRouter }