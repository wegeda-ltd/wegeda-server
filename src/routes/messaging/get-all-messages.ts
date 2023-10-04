import { Request, Response, Router } from "express";
import { currentUser, requireAuth, } from "../../middlewares";
import { ChatGroup, ChatMessage } from "../../models";
import { BadRequestError } from "../../errors";

const router = Router();

router.get(
    "/api/messages",
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {

        const pageSize: any = req.query.pageSize || 10
        const page: any = req.query.page || 1
        const skip = (page - 1) * pageSize;

        const messages = await ChatGroup.find({
            users: req.currentUser!.id
        }).populate({
            path: "messages",
            options: { sort: { createdAt: -1 } }
        }).populate({ path: "users", select: 'first_name last_name profile_image status' }).sort({ createdAt: -1 })
            .skip(skip).limit(pageSize)


        const totalMsgs = await ChatGroup.countDocuments({ users: req.currentUser!.id });
        const totalPages = Math.ceil(totalMsgs / pageSize);
        const nextPage = totalPages > page ? page + 1 : null;

        return res.send({
            message: "Messages retrieved",
            messages,
            pagination: {
                currentPage: page,
                totalPages,
                nextPage
            }
        })
    }
);

export { router as getMessagesRouter };
