import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ListingSubscription, } from "../../models";

const router = Router()

router.post("/api/subscriptions/listing-subscription/create", currentUser, requireAuth, [
    body('subscription_title').notEmpty().withMessage('enter subscription title'),
    body('subscription_price').isFloat({ gt: 0 }).withMessage('subscription price must be greater than zero'),
    body('total_listing').isInt({ gt: 0 }).withMessage('maximum chat must be greater than zero'),

], validateRequest, async (req: Request, res: Response) => {
    const { subscription_title, subscription_price, total_listing } = req.body

    const listing_subscription = ListingSubscription.build({
        subscription_title,
        subscription_price,
        total_listing
    })

    await listing_subscription.save()
    res.status(201).send({ message: 'Subscription created' })

})

export { router as createListingSubscriptionRouter }