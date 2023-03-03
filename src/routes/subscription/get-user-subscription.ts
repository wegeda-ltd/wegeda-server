import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatSubscription, ListingSubscription, UserSubscription, } from "../../models";
import { UserType } from "../../types";

const router = Router()

router.get("/api/subscriptions/user-subscription", currentUser, requireAuth,
    validateRequest, async (req: Request, res: Response) => {


        let user_subscription = await UserSubscription.findOne({ user: req.currentUser!.id })

        if (!user_subscription) {
            throw new NotFoundError("You have not subscribed")
        }
        let subscription = req.currentUser!.profile_type == UserType.HouseSeeker ?
            await ChatSubscription.findById(user_subscription.subscription) :
            await ListingSubscription.findById(user_subscription.subscription)

        delete user_subscription.subscription

        res.status(200).send({ message: 'Subscription retrieved', user_subscription, subscription })

    })

export { router as getuserSubscriptionRouter }