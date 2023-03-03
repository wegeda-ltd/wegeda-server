import { Request, Response, Router } from "express";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, } from "../../middlewares";
import { Notification } from "../../models";

const router = Router()

router.delete("/api/notification/delete/:notification_id", currentUser, requireAuth, async (req: Request, res: Response) => {

    const notification = await Notification.findById(req.params.notification_id)

    if (!notification) {
        throw new NotFoundError("Notification not found")
    }

    await notification.delete()


    res.status(200).send({ message: 'Notification deleted!', })

})

export { router as deleteNotificationRouter }