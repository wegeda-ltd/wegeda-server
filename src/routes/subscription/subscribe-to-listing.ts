import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError, NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ListingSubscription, UserSubscription, } from "../../models";
import { DateClass } from "../../services/date";
import { UserType } from "../../types";

const router = Router()

router.post("/api/subscriptions/listing-subscription/:subscription_id/subscribe", currentUser, requireAuth,
    [
        body('duration').isInt({ gt: 0 }).withMessage('duration must be greater than zero'),
    ], validateRequest, async (req: Request, res: Response) => {


        if (req.currentUser!.profile_type == UserType.HouseSeeker) {
            throw new BadRequestError("House seekers can't subscribe to list")
        }
        const { duration } = req.body

        const listing_subscription = await ListingSubscription.findById(req.params.subscription_id)

        if (!listing_subscription) {
            throw new NotFoundError("Subscription not found!")
        }

        const exisitingSubscription = await UserSubscription.findOne({ user: req.currentUser!.id, subscription: req.params.subscription_id })

        if (exisitingSubscription) {
            exisitingSubscription.set({
                amount_left: exisitingSubscription.amount_left + listing_subscription.total_listing,
                expiry_date: exisitingSubscription.is_expired ? DateClass.get_expiry_date({ duration, created_at: new Date() }) : DateClass.get_expiry_date({ duration, created_at: new Date(exisitingSubscription.expiry_date) })
            })

            await exisitingSubscription.save()

            return res.status(200).send({ message: 'Subscription renewed successfully' })

        }


        const user_subscription = UserSubscription.build({
            user: req.currentUser!.id,
            subscription: listing_subscription._id,
            amount_left: listing_subscription.total_listing,
            expiry_date: DateClass.get_expiry_date({ duration, created_at: new Date() }),
            duration
        })

        await user_subscription.save()
        res.status(200).send({ message: 'Subscribed successfully' })

    })

export { router as subscribeToListRouter }