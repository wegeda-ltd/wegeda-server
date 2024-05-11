import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatGroup, ChatMessage, User, } from "../../models";
import { BadRequestError } from "../../errors";
import { getAllMessages } from "./get-all-messages";

const router = Router();

router.post(
    "/api/messages",
    currentUser,
    requireAuth,
    [
        body("users")
            .isArray({ min: 1 })
            .withMessage("You need to chat with someone"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {
            users,
            text,
            images,
            type
        } = req.body;

        const user = await User.findById(users.filter((user: string) => user !== req.currentUser!.id)[0])

        if (!text && !images) {
            throw new BadRequestError("Please send a message")
        }

        const chatUsers = [req.currentUser?.id, ...users]


        let chatGroup: any = await ChatGroup.findOne({
            users: { $all: chatUsers },
            type: type ? type : 'chat'    // , ...users]
        })

        if (!chatGroup) {
            chatGroup = ChatGroup.build({
                users: [req.currentUser?.id, ...users],
                name: `${user?.first_name} ${user?.last_name}`,
                type: type ? type : 'chat',
                isGroup: type === 'chat' ? false : true
            })

            await chatGroup.save()
        }
        const message = ChatMessage.build({
            text,
            images,
            from: req.currentUser!.id,
            group: chatGroup.id,
            read_by: [req.currentUser!.id]
        })

        await message.save()



        chatGroup.messages.push(message.id)

        const pageSize: any = 10
        const page: any = 1
        const skip = (page - 1) * pageSize;


        const chat = await ChatMessage.find({
            group: chatGroup.id
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

        await chatGroup.save()

        const totalMsgs = await ChatMessage.countDocuments({
            group: req.params.id
        });
        const totalPages = Math.ceil(totalMsgs / pageSize);
        const nextPage = totalPages > page ? parseInt(page) + 1 : null;


        const {messages, unread, pagination} =  await getAllMessages(req)

        req.io.emit("messages", {messages, unread, pagination})
        return res.send({
            message: "Messages retrieved",
            chat: chat.reverse(),
            group: chatGroup.id,
            pagination: {
                pageSize,
                currentPage: page,
                totalPages,
                nextPage
            }
        })

    }
);

export { router as sendMessageRouter };
