import { Request, Response, Router } from "express";
import { currentUser, requireAuth, } from "../../middlewares";
import { ChatGroup, ChatMessage, } from "../../models";

const router = Router();

router.get(
    "/api/messages/:id/",
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {

        const pageSize: any = req.query.pageSize || 10
        const page: any = req.query.page || 1
        const skip = (page - 1) * pageSize;


        await ChatMessage.updateMany({
            group: req.params.id,
            read_by: { $ne: req.currentUser!.id } // Check if currentUser ID is not already in the read_by array
        },
            {
                $addToSet: { read_by: req.currentUser!.id }
            })

        const chat = await ChatMessage.find({
            group: req.params.id
        }).populate("from")
            .populate({
                path: "group",
                select: "users",
                populate: {
                    path: "users",
                    select: "status"
                }


            }).sort({ createdAt: -1 })
            .skip(skip).limit(pageSize)


        const totalMsgs = await ChatMessage.countDocuments({
            group: req.params.id
        });
        const totalPages = Math.ceil(totalMsgs / pageSize);
        const nextPage = totalPages > page ? parseInt(page) + 1 : null;


        return res.send({
            message: "Messages retrieved",
            chat,
            pagination: {
                pageSize,
                currentPage: page,
                totalPages,
                nextPage
            }
        })
    }
);

export { router as getMessageDetailsRouter };
