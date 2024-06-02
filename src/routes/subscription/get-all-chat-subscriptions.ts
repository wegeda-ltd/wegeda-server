import { Request, Response, Router } from "express";
import { currentUser, requireAuth } from "../../middlewares";
import { ChatSubscription, UserSubscription, } from "../../models";

const router = Router()

router.get("/api/subscriptions/chat-subscription/all",
    // currentUser, requireAuth,
    async (req: Request, res: Response) => {

        const chat_subscriptions = await ChatSubscription.find()


        const user_subscriptions = await UserSubscription.find({}).populate('user')


        const updatedChatSubscriptions = chat_subscriptions.map(sub => {
            const user_sub_count = user_subscriptions.filter((u_sub: any) => u_sub.subscription.toString() === sub.id);
            delete sub._id
            return {
                ...sub.toObject(),
                id: sub.id,
                //    @ts-ignore
                subscribers: user_sub_count
            };
        });


        // console.log(chat_subscriptions, "SUBS")
        res.status(200).send({ message: 'Subscriptions retrieved', chat_subscriptions: updatedChatSubscriptions })

    })

export { router as getAllChatSubscriptionRouter }