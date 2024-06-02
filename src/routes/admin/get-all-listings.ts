import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing } from "../../models";

import { Pagination } from "../../services/pagination";

const router = Router();


router.get(
    "/api/admin/listings/all/",
    // currentUser,
    // requireAuth,
    async (req: Request, res: Response) => {
        const {
            title,
            status,
            page = 1,
            perPage = 10
        }: any = req.query;


        const filters: { [key: string]: any } = {};

        if (status && status !== 'all') {
            filters.listing_status = status;
        }

        if (title) {
            filters.listing_title = { $regex: title, $options: 'i' };
        }

        const pageSize = perPage as number;

        const currentPage = page as number || 1
        const skip = (currentPage - 1) * pageSize;


        const totalDocuments = await Listing.countDocuments(filters);
        const totalPages = Math.ceil(totalDocuments / pageSize);

        const listings = await Listing.find(filters).populate('user')
            .sort({ createdAt: -1 }).skip(skip).limit(pageSize)

        const pages = Pagination.getPages({ totalPages, req, pageSize: pageSize })

        const pagination = {
            total: totalDocuments,
            perPage,
            totalPages,
            page,
            urls: pages
        }


        // console.log(pagination)
        res.status(200).send({
            message: "Listings retrieved",
            listings,
            pagination
        });
    }
);

export { router as getAllListingsAdminRouter };
