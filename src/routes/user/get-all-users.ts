import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { HouseSeeker } from "../../models";
import { GenderType } from "../../types";

const router = Router();

interface IUsersFilters {
  gender?: any;
  favorites?: any;

  cooks?: any;
  religion?: any;
  partying?: any;
  description?: any;
  interests?: any;
  smokes?: any;
  drinks?: any;
  cleans_room?: any;
  budget?: any;
}

router.get(
  "/api/users",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const {
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
    } = req.query;

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
    let filters: IUsersFilters = {};

    if (budget_range) {
      // @ts-ignore
      const budget = budget_range.split(",");
      filters.budget = {
        $in: budget,
      };
    }

    if (gender) {
      filters.gender = gender;
    }

    if (description) {
      // @ts-ignore
      const desc = description.split(",");
      filters.description = {
        $in: desc,
      };
    }

    if (interests) {
      // @ts-ignore
      const ints = interests.split(",");
      filters.interests = {
        $in: ints,
      };
    }

    if (smokes) {
      filters.smokes = smokes;
    }

    if (drinks) {
      filters.smokes = drinks;
    }

    if (cleans_room) {
      filters.cleans_room = cleans_room;
    }

    if (cooks) {
      filters.cooks = cooks;
    }

    if (religion) {
      filters.religion = religion;
    }

    if (partying) {
      filters.partying = partying;
    }

    console.log(filters, "FILTERS");
    const users = await HouseSeeker.paginate(
      {
        user: { $ne: req.currentUser!.id },
        ...filters,
      },
      options
    );

    res.status(200).send({
      message: "Users retrieved",
      users: users.itemsList,
      paginator: users.paginator,
    });
  }
);

export { router as getAllUsersRouter };
