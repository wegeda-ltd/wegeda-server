import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError, NotFoundError, ServerError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ListingSubscription, UserSubscription, Payment as PaymentModel } from "../../models";

import { DateClass } from "../../services/date";
import { Payment } from "../../services/payment";
import { UserType } from "../../types";

const router = Router()

router.post("/api/subscriptions/listing-subscription/:subscription_id/subscribe", currentUser, requireAuth,
    [body('reference').notEmpty().withMessage('please enter the payment reference'),
    ], validateRequest, async (req: Request, res: Response) => {

        const { reference } = req.body

        const paymentVerified = await new Payment().verifyPayment(reference)


        if (!paymentVerified.status) {
            throw new ServerError('An Error Occurred')
        }

        const payment = await PaymentModel.findOne({
            reference
        })

        if (!payment) {
            throw new NotFoundError('Payment not found!')
        }

        const listing_subscription = await ListingSubscription.findById(payment.subscription_id)

        if (!listing_subscription) {
            throw new NotFoundError("Subscription not found!")
        }

        const exisitingSubscription = await UserSubscription.findOne({ user: req.currentUser!.id, subscription: payment.subscription_id })

        if (exisitingSubscription) {
            exisitingSubscription.set({
                amount_left: exisitingSubscription.amount_left + listing_subscription.total_listing,
                expiry_date: exisitingSubscription.is_expired ? DateClass.get_expiry_date({ duration: payment.duration, created_at: new Date() }) : DateClass.get_expiry_date({ duration: payment.duration, created_at: new Date(exisitingSubscription.expiry_date) })
            })

            await exisitingSubscription.save()

            return res.status(200).send({ message: 'Subscription renewed successfully' })

        }


        const user_subscription = UserSubscription.build({
            user: req.currentUser!.id,
            subscription: listing_subscription._id,
            amount_left: listing_subscription.total_listing,
            expiry_date: DateClass.get_expiry_date({ duration: payment.duration, created_at: new Date() }),
            duration: payment.duration
        })

        await user_subscription.save()
        res.status(200).send({ message: 'Subscribed successfully' })

    })

export { router as subscribeToListRouter }