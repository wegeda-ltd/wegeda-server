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

        try {


            const listing: any = await Listing
                .findById(req.params.listing_id)
                .populate("on_stand_by").populate("user")

            if (!listing) {
                throw new NotFoundError("Listing not found")
            }

            let thisUser;
            let verifications: any;
            let is_verified = VerificationStatus.NotVerified
            if (listing.user.profile_type == UserType.HouseSeeker) {
                thisUser = await HouseSeeker.findOne({ user: listing.user.id }).populate("user")
                verifications = await Verification.findOne({ user: listing.user.id })


            } else {
                thisUser = await Agent.findOne({ user: listing.user.id }).populate("user")
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
        } catch (error) {
            console.log(error, "ERROR FROM HERE")
        }
    })

export { router as getListingByIdRouter }