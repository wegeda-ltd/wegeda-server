import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatSubscription, } from "../../models";

const router = Router()

router.post("/api/subscriptions/chat-subscription/create", currentUser, requireAuth, [
    body('subscription_title').notEmpty().withMessage('enter listing title'),
    body('subscription_price').isFloat({ gt: 0 }).withMessage('listing price must be greater than zero'),
    body('subscription_maximum_chat').isInt({ gt: 0 }).withMessage('maximum chat must be greater than zero'),

], validateRequest, async (req: Request, res: Response) => {
    const { subscription_title, subscription_price, subscription_maximum_chat } = req.body

    const chat_subscription = ChatSubscription.build({
        subscription_title,
        subscription_price,
        subscription_maximum_chat
    })

    await chat_subscription.save()
    res.status(201).send({ message: 'Subscription created' })

})

export { router as createChatSubscriptionRouter }