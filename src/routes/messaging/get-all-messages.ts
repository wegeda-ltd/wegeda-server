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

        const messages = await ChatGroup.find({
            users: req.currentUser!.id
        }).populate({
            path: "messages",
            options: { sort: { createdAt: -1 } }
        }).populate({ path: "users", select: 'first_name last_name profile_image' }).sort({ createdAt: -1 })
        // const messages = await ChatGroup.find({
        //     users: req.currentUser!.id
        // }).populate({
        //     path: 'users',
        //     select: 'first_name last_name profile_image'
        // }).populate({
        //     path: 'messages',
        //     match: { is_read: false },
        // })

        // const messages =
        //     await ChatGroup.aggregate([
        //         {
        //             $lookup: {
        //                 from: 'users', localField: 'users',
        //                 foreignField: '_id',
        //                 as: 'userDetails',
        //             },
        //         },
        //         // {
        //         //     $unwind: '$userDetails',
        //         // },
        //         {
        //             $lookup: {
        //                 from: 'chat-messages', localField: 'messages',
        //                 foreignField: '_id',
        //                 as: 'messages',
        //             },
        //         },
        //         {
        //             $addFields: {
        //                 unreadMessageCount: {
        //                     $size: {
        //                         $filter: {
        //                             input: '$messages',
        //                             as: 'message',
        //                             cond: { $eq: ['$$message.is_read', false] },
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //         {
        //             $unwind: '$messages',
        //         },
        //         {
        //             $sort: {
        //                 'messages.createdAt': -1,
        //             },
        //         },
        //         {
        //             $group: {
        //                 _id: '$_id',
        //                 users: { $first: '$userDetails' },
        //                 messages: { $push: '$messages' },
        //                 unreadMessageCount: { $first: '$unreadMessageCount' },
        //                 createdAt: { $first: '$createdAt' },
        //             },
        //         },
        //         {
        //             $sort: {
        //                 createdAt: 1, // Sort groups based on createdAt
        //             },
        //         },
        //     ]).sort({ createdAt: -1 })
        return res.send({ message: "Messages retrieved", messages })
    }
);

export { router as getMessagesRouter };
