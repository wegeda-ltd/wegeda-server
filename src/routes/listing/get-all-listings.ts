import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing } from "../../models";
import { UserType } from "../../types";
import { Pagination } from "../../services/pagination";

const router = Router();

interface IFilters {
  state?: any;
  room_type?: any;
  monthly_payment?: any;
  city?: any;
}
router.get(
  "/api/listings/all/",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { state, room_type, budget_range, city, page = 1, perPage = 10 } = req.query;



    let filters: IFilters = {};

    if (state) {
      filters.state = state;
    }
    if (room_type) {
      // @ts-ignore
      filters.room_type = room_type.toLocaleString().trim().toLowerCase().replaceAll(' ', '-');
    }

    if (city) {
      filters.city = city;
    }
    if (budget_range) {
      // @ts-ignore
      const budget = budget_range.split(",");
      filters.monthly_payment = {
        $lte: parseFloat(budget[1]),
        $gte: parseFloat(budget[0]),
      };
    }
    const pageSize = perPage as number;

    const currentPage = page as number || 1
    const skip = (currentPage - 1) * pageSize;


    const totalDocuments = await Listing.countDocuments({ ...filters });
    const totalPages = Math.ceil(totalDocuments / pageSize);
    const listings = await Listing.find({ ...filters }).populate("user")
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

export { router as getAllListingsRouter };
