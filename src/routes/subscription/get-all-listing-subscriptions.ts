import { Request, Response, Router } from "express";
import { currentUser, requireAuth } from "../../middlewares";
import { ListingSubscription, } from "../../models";

const router = Router()

router.get("/api/subscriptions/listing-subscription/all",
    // currentUser,
    // requireAuth,
    async (req: Request, res: Response) => {

        const listing_subscriptions = await ListingSubscription.find()

        res.status(200).send({ message: 'Subscriptions retrieved', listing_subscriptions })

    })

export { router as getAllListingSubscriptionRouter }