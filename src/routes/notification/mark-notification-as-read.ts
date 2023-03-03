import { Request, Response, Router } from "express";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Notification } from "../../models";

const router = Router()

router.patch("/api/notification/mark-as-read", currentUser, requireAuth, async (req: Request, res: Response) => {


    await Notification.updateMany({
        user: req.currentUser!.id, is_read: false
    }, { $set: { is_read: true } })


    res.status(200).send({ message: 'Notifications marked as read!', })

})

export { router as markNotificationAsReadRouter }