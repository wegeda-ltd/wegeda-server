import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError, NotFoundError, ServerError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatSubscription, ListingSubscription, Payment as PaymentModel } from "../../models";
import { Payment } from "../../services";
import { SubscriptionType, UserType } from "../../types";

const router = Router()

router.post("/api/subscriptions/:subscription_id/pay", currentUser, requireAuth,
    [
        body('duration').isInt({ gt: 0 }).withMessage('duration must be greater than zero'),

    ], validateRequest, async (req: Request, res: Response) => {
        const { duration } = req.body


        let subscription_plan;
        if (req.currentUser!.profile_type == UserType.Agent) {
            subscription_plan = await ListingSubscription.findById(req.params.subscription_id)

        } else {
            subscription_plan = await ChatSubscription.findById(req.params.subscription_id)
        }

        if (!subscription_plan) {
            throw new NotFoundError("Subscription not found!")
        }


        let userData = {
            amount: (subscription_plan.subscription_price) * duration * 100,
            email: req.currentUser!.email,
        }

        // Make Payment
        const response = await new Payment().initializePaystack(userData)

        if (!response.status) {
            throw new ServerError('An Error Occurred')
        }

        const payment = PaymentModel.build({
            user: req.currentUser!.id,
            reference: response.data.reference,
            subscription_type: req.currentUser!.profile_type == UserType.HouseSeeker ? SubscriptionType.Chat : SubscriptionType.Listing,
            subscription_id: req.params.subscription_id,
            subscription_price: (subscription_plan.subscription_price) * duration,
            duration
        })

        await payment.save()

        res.status(200).send({ message: 'payment initialized', details: response.data })

    })

export { router as initializePaymentRouter }