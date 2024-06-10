import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatSubscription, ListingSubscription, User, UserSubscription, } from "../../models";
import { UserType } from "../../types";

const router = Router()

router.get("/api/subscriptions/user-subscription",
    currentUser, requireAuth,
    async (req: Request, res: Response) => {

        const user_id = req.query.user_id

        if (user_id) {
            let user_subscription = await UserSubscription.find({ user: user_id })

            let user = await User.findById(user_id)

            const subscriptions = [];
            if (user_subscription.length) {
                for (const subscription of user_subscription) {
                    if (user?.profile_type == UserType.HouseSeeker) {
                        const sub = await ChatSubscription.findById(subscription.subscription)
                        subscriptions.push(sub)
                    } else {
                        const sub = await ListingSubscription.findById(subscription.subscription)
                        subscriptions.push(sub)
                    }
                }
            }


            return res.status(200).send({ message: 'Subscription retrieved', user_subscription, subscriptions })

        } else {
            let user_subscription = await UserSubscription.findOne({ user: req.currentUser!.id, is_expired: false })


            if (!user_subscription) {
                return res.status(200).send({ message: 'Subscription retrieved', account_type: req.currentUser!.profile_type, user_subscription: null, subscription: null })
            }
            let subscription = req.currentUser!.profile_type == UserType.HouseSeeker ?
                await ChatSubscription.findById(user_subscription.subscription) :
                await ListingSubscription.findById(user_subscription.subscription)

            delete user_subscription.subscription

            return res.status(200).send({ message: 'Subscription retrieved', user_subscription, subscription })
        }


    })

export { router as getUserSubscriptionRouter }