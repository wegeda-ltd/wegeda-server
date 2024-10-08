import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError, NotFoundError, ServerError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatSubscription, Payment as PaymentModel, UserSubscription, } from "../../models";
import { Payment } from "../../services";
import { DateClass } from "../../services/date";
import { UserType } from "../../types";
import { subscribe } from "./initialize-payment";

const router = Router()

router.post("/api/subscriptions/chat-subscription/subscribe", currentUser, requireAuth,
    [
        body('reference').notEmpty().withMessage('please enter the payment reference'),
        body('duration').isInt({ gt: 0 }).withMessage('duration must be greater than zero'),
        body('subscription_id').notEmpty().withMessage('enter subscription id'),


    ], validateRequest, async (req: Request, res: Response) => {

        const { reference, duration, subscription_id } = req.body

        await subscribe({ user_id: req.currentUser!.id, reference, duration, subscription_id, profile_type: req.currentUser!.profile_type })
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

        const chat_subscription = await ChatSubscription.findById(payment.subscription_id)

        if (!chat_subscription) {
            throw new NotFoundError("Subscription not found!")
        }

        const exisitingSubscription = await UserSubscription.findOne({ user: req.currentUser!.id, subscription: payment.subscription_id })

        if (exisitingSubscription && !exisitingSubscription.is_expired) {

            exisitingSubscription.set({
                subscription: chat_subscription.id,
                amount_left: exisitingSubscription.amount_left + chat_subscription.subscription_maximum_chat,
                expiry_date: DateClass.get_expiry_date({ duration: payment.duration, created_at: new Date(exisitingSubscription.expiry_date) })
            })

            await exisitingSubscription.save()

            return res.status(200).send({ message: 'Subscription renewed successfully' })


        }
        const user_subscription = UserSubscription.build({
            user: req.currentUser!.id,
            subscription: chat_subscription._id,
            amount_left: chat_subscription.subscription_maximum_chat,
            expiry_date: DateClass.get_expiry_date({ duration: payment.duration, created_at: new Date() }),
            duration: payment.duration
        })

        console.log("DONE")
        await user_subscription.save()
        res.status(200).send({ message: 'Subscribed successfully' })

    })

export { router as subscribeToChatRouter }