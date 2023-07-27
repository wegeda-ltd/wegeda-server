import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing } from "../../models";
import { UserType } from "../../types";

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
    const { state, room_type, budget_range, city } = req.query;


    const myCustomLabels = {
      totalDocs: "itemCount",
      docs: "itemsList",
      limit: "perPage",
      page: "currentPage",
      nextPage: "next",
      prevPage: "prev",
      totalPages: "pageCount",
      pagingCounter: "slNo",
      meta: "paginator",
    };

    const options = {
      page: 1,
      limit: 10,
      customLabels: myCustomLabels,
      populate: ["user"],
    };

    let filters: IFilters = {};

    if (state) {
      filters.state = state;
    }
    if (room_type) {
      filters.room_type = room_type;
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
    // let listings;
    // if (state && room_type && budget_range) {
    //   listings = await Listing.paginate(
    //     {
    //       state,
    //       room_type,
    //       budget: { $lte: budget_range[0], $gte: budget_range[1] },
    //     },
    //     options
    //   );
    // } else {

    const listings = await Listing.paginate({ ...filters }, options);

    // }

    res.status(200).send({
      message: "Listings retrieved",
      listings: listings.itemsList,
      paginator: listings.paginator,
    });
  }
);

export { router as getAllListingsRouter };
