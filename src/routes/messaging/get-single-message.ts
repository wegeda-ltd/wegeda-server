import { Request, Response, Router } from "express";
import { currentUser, requireAuth, } from "../../middlewares";
import { ChatGroup, ChatGroupDoc, ChatMessage, } from "../../models";
import { Types } from "mongoose";

const router = Router();

router.get(
    "/api/messages/:id/:userId",
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {

        const pageSize: any = req.query.pageSize || 10
        const page: any = req.query.page || 1
        const skip = (page - 1) * pageSize;

        let chatGroup: any;
        // const chatGroup: (ChatGroupDoc & {
        //     _id: Types.ObjectId;
        // }) | null;
        if (req.params.id == 'undefined') {
            chatGroup = await ChatGroup.findOne({
                users: [req.currentUser?.id, req.params.userId]
            })

        }



        const groupId = req.params.id != "undefined" ? req.params.id : chatGroup?.id;


        if (groupId) {
            await ChatMessage.updateMany({
                group: groupId,
                read_by: { $ne: req.currentUser!.id }
            },
                {
                    $addToSet: { read_by: req.currentUser!.id }
                })

        }


        if (groupId) {
            const chat = await ChatMessage.find(
                { group: groupId }
            ).populate("from")
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
                group: groupId
            });
            const totalPages = Math.ceil(totalMsgs / pageSize);
            const nextPage = totalPages > page ? parseInt(page) + 1 : null;


            return res.send({
                message: "Messages retrieved",
                chat: chat.reverse(),
                pagination: {
                    pageSize,
                    currentPage: page,
                    totalPages,
                    nextPage
                }
            })

        } else {
            return res.send({
                message: "Testing 1 2 3",
                chat: [],
                pagination: {
                    pageSize,
                    currentPage: 1,
                    totalPages: 0,
                    nextPag: null
                }
            })
        }

    }
);

export { router as getMessageDetailsRouter };
