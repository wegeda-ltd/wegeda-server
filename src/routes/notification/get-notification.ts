import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { NotFoundError } from "../../errors";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Notification } from "../../models";

const router = Router()

router.get("/api/notification/notification_id", currentUser, requireAuth, [

], validateRequest, async (req: Request, res: Response) => {



    const notification = Notification.findById(req.params.notification_id)

    if (!notification) {
        throw new NotFoundError("Notification not found!")
    }
    res.status(200).send({ message: 'Notification retrieved!', notification })

})

export { router as getNotificationRouter }