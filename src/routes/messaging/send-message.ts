import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatGroup, ChatMessage, User, } from "../../models";
import { BadRequestError } from "../../errors";

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
            images
        } = req.body;

        const user = await User.findById(users[0])

        if (!text && !images) {
            throw new BadRequestError("Please send a message")
        }

        const chatUsers = [req.currentUser?.id, ...users]

        let chatGroup: any = await ChatGroup.findOne({
            users: { $all: chatUsers }     // , ...users]
        })

        if (!chatGroup) {
            chatGroup = ChatGroup.build({
                users: [req.currentUser?.id, ...users],
                name: `${user?.first_name} ${user?.last_name}`
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

        const messages = await ChatMessage.find({
            group: chatGroup.id
        }).populate("from")




        await chatGroup.save()
        return res.send({ message: "Message sent", messages })

    }
);

export { router as sendMessageRouter };
