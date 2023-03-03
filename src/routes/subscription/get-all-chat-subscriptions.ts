import { Request, Response, Router } from "express";
import { currentUser, requireAuth } from "../../middlewares";
import { ChatSubscription, } from "../../models";

const router = Router()

router.get("/api/subscriptions/chat-subscription/all", currentUser, requireAuth, async (req: Request, res: Response) => {

    const chat_subscriptions = await ChatSubscription.find()

    res.status(200).send({ message: 'Subscriptions retrieved', chat_subscriptions })

})

export { router as getAllChatSubscriptionRouter }