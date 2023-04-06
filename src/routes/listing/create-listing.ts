import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Listing, UserSubscription, Verification, } from "../../models";
import { DateClass } from "../../services/date";
import { ListingStatus, UserType, VerificationStatus } from "../../types";

const router = Router()

router.post("/api/listings/create", currentUser, requireAuth, [
    body('room_type').notEmpty().withMessage('enter room type'),
    body('monthly_payment').isFloat({ gt: 0 }).withMessage('monthly payment must be greater than zero'),
    body('total_bedroom').isInt({ gt: 0 }).withMessage('total bedroom must be greater than zero'),
    body('total_bathroom').isInt({ gt: 0 }).withMessage('total bathroom must be greater than zero'),
    body('minimum_stay').isInt({ gt: 0 }).withMessage('minimum stay must be greater than zero'),
    body('state').notEmpty().withMessage('what state is it located?'),
    body('city').notEmpty().withMessage('what city is it located?'),
    body('about_room').notEmpty().withMessage('tell us about the listing'),
    body('listing_title').notEmpty().withMessage('give the listing a title'),
    body('listing_features').isArray({ min: 1 }).withMessage('add the listing features'),
    body('listing_images').isArray({ min: 1 }).withMessage('add at least 4 images of listing'),

], validateRequest, async (req: Request, res: Response) => {

    const has_subscribed = await UserSubscription.findOne({ user: req.currentUser!.id })

    if (req.currentUser!.profile_type == UserType.Agent) {
        if (!has_subscribed) {
            throw new BadRequestError("You're not subscribed to list")
        }

        if (has_subscribed.amount_left <= 0) {
            throw new BadRequestError("Your subscription is exhausted")

        }

        if (has_subscribed.is_expired || DateClass.has_expired({ created_at: new Date(has_subscribed.expiry_date), duration: has_subscribed.duration })) {
            if (!has_subscribed.is_expired) {
                has_subscribed.set({
                    is_expired: true
                })
            }

            await has_subscribed.save()
            throw new BadRequestError("Your subscription has expired")

        }

    }

    let verifications = await Verification.findOne({ user: req.currentUser!.id })
    let is_verified = false;
    if (verifications) {
        if (
            (verifications.address_history_verified == VerificationStatus.Verified &&
                verifications.social_media_verified == VerificationStatus.Verified &&
                verifications.income_verified == VerificationStatus.Verified &&
                verifications.occupation_verified == VerificationStatus.Verified &&
                verifications.nin_verified == VerificationStatus.Verified)
            || req.currentUser!.profile_type == UserType.Agent

        ) {
            is_verified = true
        } else {
            is_verified = false
        }
    }
    const { room_type, total_bathroom, total_bedroom, state, city, monthly_payment, minimum_stay, about_room, listing_title, listing_features, listing_images, status } = req.body

    const new_listing = Listing.build({
        is_verified,
        user: req.currentUser!.id,
        room_type,
        total_bedroom,
        total_bathroom,
        state,
        city,
        monthly_payment,
        minimum_stay,
        about_room,
        listing_title,
        listing_features,
        listing_images,
        listing_status: status ? status : ListingStatus.Published,
        on_stand_by: [],
        listing_type: req.currentUser!.profile_type == UserType.Agent ? UserType.Agent : UserType.HouseSeeker
    })

    await new_listing.save()

    if (req.currentUser!.profile_type == UserType.Agent && has_subscribed) {
        has_subscribed.set({
            amount_left: has_subscribed.amount_left - 1
        })
    }
    res.status(201).send({ message: 'Listing created' })

})

export { router as createListingRouter }