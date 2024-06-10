import { Request, Response, Router } from "express";
import { query, } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { ChatGroup, ChatMessage, User, } from "../../models";
import { BadRequestError, NotFoundError } from "../../errors";

const router = Router();

router.get(
    "/api/messages/get-group",
    currentUser,
    requireAuth,
    [
        query("roommates")
            .isArray({ min: 2 })
            .withMessage("Who and who are checkin in?"),
    ],
    validateRequest,

    async (req: Request, res: Response) => {



        let chatGroup: any = await ChatGroup.findOne({
            users: { $all: req.query.roommates },
            type: 'agreement'
        })

        if (!chatGroup) {
            throw new NotFoundError("No Group Found!")
        }

        return res.send({
            message: "Messages retrieved",
            group: chatGroup.id,

        })

    }
);

export { router as getGroupRouter };
