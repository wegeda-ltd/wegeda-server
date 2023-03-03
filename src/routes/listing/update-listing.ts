import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Listing } from "../../models";

const router = Router()

router.patch("/api/listings/:listing_id/update", currentUser, requireAuth, async (req: Request, res: Response) => {

    const { room_type, total_bathroom, total_bedroom, state, city, monthly_payment, minimum_stay, about_room, listing_title, listing_features, listing_images, status } = req.body

    const listing = await Listing.findById(req.params.listing_id)

    if (!listing) {
        throw new NotFoundError("Listing not found")
    }

    listing.set({
        room_type: room_type ? room_type : listing.room_type,
        total_bedroom: total_bedroom ? total_bedroom : listing.total_bedroom,
        total_bathroom: total_bathroom ? total_bathroom : listing.total_bathroom,
        state: state ? state : listing.state,
        city: city ? city : listing.city,
        monthly_payment: monthly_payment ? monthly_payment : listing.monthly_payment,
        minimum_stay: minimum_stay ? minimum_stay : listing.minimum_stay,
        about_room: about_room ? about_room : listing.about_room,
        listing_title: listing_title ? listing_title : listing.listing_title,
        listing_features: listing_features ? listing_features : listing.listing_features,
        listing_images: listing_images ? listing_images : listing.listing_images,
        status: status ? status : listing.status,
    })

    await listing.save()

    res.status(201).send({ message: 'Listing updated' })

})

export { router as updateListingRouter }