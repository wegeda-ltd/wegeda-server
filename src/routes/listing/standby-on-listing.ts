import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, } from "../../middlewares";
import { Listing, } from "../../models";

const router = Router()

router.post("/api/listings/:listing_id/standby", currentUser, requireAuth,
    async (req: Request, res: Response) => {

        const listing = await Listing.findById(req.params.listing_id)

        if (!listing) {
            throw new NotFoundError("Listing not found")
        }

        if (listing.on_stand_by.includes(req.currentUser!.id)) {
            await listing.updateOne({
                $pull: { on_stand_by: req.currentUser!.id }
            })

        } else {
            await listing.updateOne({
                $push: { on_stand_by: req.currentUser!.id }
            })

        }

        res.status(201).send({ message: !listing.on_stand_by.includes(req.currentUser!.id) ? 'Added to standby' : 'Removed fron standby' })

    })

export { router as standbyOnListingRouter }