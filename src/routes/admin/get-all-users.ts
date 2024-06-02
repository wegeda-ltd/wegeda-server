import { Request, Response, Router } from "express";

import { currentUser, requireAuth } from "../../middlewares";
import { Agent, HouseSeeker, MySearch, User } from "../../models";

import { Pagination } from "../../services/pagination";
import { UserType } from "../../types";

const router = Router();


router.get(
  "/api/admin/users",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const {
      type,
      page
    }: any = req.query;




    const perPage = 10;
    const currentPage = page as number || 1
    const skip = (currentPage - 1) * perPage;


    const filter = type === 'agent' || type === 'house-seeker' ? {
      profile_type: type === 'agent' ? UserType.Agent : UserType.HouseSeeker
    } : {}
    const users = await User.find(
      filter).sort({ 'createdAt': -1 })
      .skip(skip)
      .limit(perPage)

    const totalDocuments = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalDocuments / perPage);



    const pages = Pagination.getPages({ totalPages, req, pageSize: perPage })

    const pagination = {
      total: totalDocuments,
      perPage,
      totalPages,
      page,
      urls: pages
    }


    res.status(200).send({
      message: "Users retrieved",
      users: users,
      pagination
    });
  }
);

export { router as getAllUsersAdminRouter };
