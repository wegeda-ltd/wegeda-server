import { Request, Response, Router } from "express";
import { currentUser, requireAuth, } from "../../middlewares";
import { ChatGroup, ChatMessage, } from "../../models";

const router = Router();

router.get(
    "/api/messages/:id/",
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {
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

        // const chat = await ChatGroup.findOne({
        //     group: req.params.id,
        // }).populate({
        //     path: 'users',
        //     select: 'first_name last_name profile_image'
        // }).populate({
        //     path: "messages",
        // })



        return res.send({ message: "Messages retrieved", chat })
    }
);

export { router as getMessageDetailsRouter };
