import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Notification } from "../../models";

const router = Router()

router.post("/api/notification/create", currentUser, requireAuth, [
    body('notification_message').notEmpty().withMessage('enter the notification message'),
], validateRequest, async (req: Request, res: Response) => {


    const { notification_message, notification_image, notification_route, notification_route_label } = req.body

    const notification = Notification.build({
        user: req.currentUser!.id,
        notification_message,
        notification_image,
        notification_route,
        notification_route_label
    })

    await notification.save()
    res.status(201).send({ message: 'Notification created!', })

})

export { router as createNotificationRouter }