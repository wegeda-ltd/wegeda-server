import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";

import { currentUser, requireAuth } from "../../middlewares";
import { Agent, HouseSeeker, Listing, User, Verification, VerificationDoc } from "../../models";
import { UserType, VerificationStatus } from "../../types";
import { Types } from "mongoose";

const router = Router()

router.get("/api/listings/:listing_id",
    currentUser, requireAuth,
    async (req: Request, res: Response) => {

        const listing = await Listing
            .findById(req.params.listing_id)
            .populate("on_stand_by").populate("user")

        if (!listing) {
            throw new NotFoundError("Listing not found")
        }

        const user = await User.findById(listing.user)

        if (!user) {
            throw new NotFoundError("User not found")
        }
        let thisUser;
        let verifications: any;
        let is_verified = VerificationStatus.NotVerified
        if (user.profile_type == UserType.HouseSeeker) {
            thisUser = await HouseSeeker.findOne({ user: user.id }).populate("user")
            verifications = await Verification.findOne({ user: user.id })

        } else {
            thisUser = await Agent.findOne({ user: user.id }).populate("user")
            is_verified = VerificationStatus.Verified
        }


        if (verifications) {
            if (verifications.occupation_verified === VerificationStatus.Verified && verifications.address_history_verified === VerificationStatus.Verified && verifications.income_verified === VerificationStatus.Verified && verifications.nin_verified === VerificationStatus.Verified && verifications.social_media_verified === VerificationStatus.Verified) {
                is_verified = VerificationStatus.Verified
            } else {

                if (
                    Object.values(verifications._doc).includes(VerificationStatus.Pending)) {
                    is_verified = VerificationStatus.Pending
                } else {
                    is_verified = VerificationStatus.NotVerified
                }
            }
        }



        res.status(200).send({ message: 'Listings retrieved', listing, user: thisUser, is_verified })

    })

export { router as getListingByIdRouter }