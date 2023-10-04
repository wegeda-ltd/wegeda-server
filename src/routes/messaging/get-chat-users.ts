import { Request, Response, Router } from "express";
import { currentUser, requireAuth, } from "../../middlewares";
import { ChatGroup, ChatMessage } from "../../models";
import { BadRequestError } from "../../errors";

const router = Router();

router.get(
    "/api/messages/chat-users",
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {

        const users = await ChatGroup.find({
            users: req.currentUser!.id
        }).populate({
            path: "messages",
            options: { sort: { createdAt: -1 } }
        }).populate({
            path: "users",
            select: 'first_name last_name profile_image'
        }).select('-name -messages')

            .sort({ createdAt: -1 })
        return res.send({ message: "Users retrieved", users })
    }
);

export { router as getChatUsersRouter };
