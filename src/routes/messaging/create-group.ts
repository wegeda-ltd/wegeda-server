import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatGroup, ChatMessage, User, } from "../../models";
import { BadRequestError } from "../../errors";

const router = Router();

router.post(
    "/api/messages/group",
    currentUser,
    requireAuth,
    [
        body("users")
            .isArray({ min: 1 })
            .withMessage("Add users to your group"),
        body("name")
            .notEmpty()
            .withMessage("Enter your group name"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {
            users,
            name,
        } = req.body;

        const user = await User.find({ _id: users })


        if (user.length < users.length) {
            throw new BadRequestError("Some users are invalid")
        }

        const chatGroup = ChatGroup.build({
            users: [req.currentUser?.id, ...users],
            name,
            admins: [req.currentUser!.id],
            isGroup: true
        })

        await chatGroup.save()

        return res.send({ message: "Group created!", group: chatGroup })

    }
);

export { router as createNewGroupRouter };
