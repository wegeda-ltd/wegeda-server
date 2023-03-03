import { Request, Response, Router } from "express";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { FinancialStatement } from "../../models";

const router = Router()

router.get("/api/verification/get-all-financials/", currentUser, requireAuth, async (req: Request, res: Response) => {


    const financials = await FinancialStatement.find()


    res.status(200).send({ message: 'Financial statements retrieved', financials })

})

export { router as getAllFinancialStatementRouter }