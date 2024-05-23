import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Listing, MySearch } from "../../models";
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
    const {
      date,
      budget_range,
      gender,
      description,
      interests,
      smokes,
      drinks,
      cleans_room,
      cooks,
      religion,
      partying,
      state,
      room_type,
      city,
      page = 1,
      perPage = 10
    }: any = req.query;



    let filters: IFilters = {};

    if (state) {
      filters.state = state;
    }
    if (room_type) {
      filters.room_type = room_type.toLocaleString().trim().toLowerCase().replaceAll(' ', '-');
    }

    if (city) {
      filters.city = city;
    }
    if (budget_range) {
      const budget = budget_range.split(",");
      filters.monthly_payment = {
        $lte: parseFloat(budget[1]),
        $gte: parseFloat(budget[0]),
      };
    }

    if (Object.keys(filters).length) {
      const mySimilarSearch = await MySearch.findOne({
        date,
        user: req.currentUser?.id
      })

      if (!mySimilarSearch) {
        await MySearch.findOneAndDelete({
          user: req.currentUser!.id
        })

        const mySearch = MySearch.build({
          user: req.currentUser!.id,
          date,
          budget_range,
          gender,
          description,
          interests,
          smokes,
          drinks,
          cleans_room,
          cooks,
          religion,
          partying,
          state,
          room_type,
          city,
        })

        await mySearch.save()
      } else {
        mySimilarSearch.set({
          budget_range,
          gender,
          description,
          interests,
          smokes,
          drinks,
          cleans_room,
          cooks,
          religion,
          partying,
          state,
          room_type,
          city
        })

        await mySimilarSearch.save()
      }
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
