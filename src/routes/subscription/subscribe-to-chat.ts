import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError, NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatSubscription, UserSubscription, } from "../../models";
import { DateClass } from "../../services/date";
import { UserType } from "../../types";

const router = Router()

router.post("/api/subscriptions/chat-subscription/:subscription_id/subscribe", currentUser, requireAuth,
    [
        body('duration').isInt({ gt: 0 }).withMessage('duration must be greater than zero'),
    ], validateRequest, async (req: Request, res: Response) => {

        if (req.currentUser!.profile_type == UserType.Agent) {
            throw new BadRequestError("Agents can't subscribe to chat")
        }
        const { duration } = req.body
        const chat_subscription = await ChatSubscription.findById(req.params.subscription_id)

        if (!chat_subscription) {
            throw new NotFoundError("Subscription not found!")
        }

        const user_subscription = UserSubscription.build({
            user: req.currentUser!.id,
            subscription: chat_subscription._id,
            amount_left: chat_subscription.subscription_maximum_chat,
            expiry_date: DateClass.get_expiry_date({ duration, created_at: new Date() }),
            duration
        })

        await user_subscription.save()
        res.status(200).send({ message: 'Subscribed successfully' })

    })

export { router as subscribeToChatRouter }