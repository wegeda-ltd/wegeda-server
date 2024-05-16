import { Request, Response, Router } from "express";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Notification } from "../../models";

const router = Router()

router.get("/api/notification/all", currentUser, requireAuth, [

], validateRequest, async (req: Request, res: Response) => {

    const notifications = await Notification.find({
        user: req.currentUser!.id
    })

    res.status(200).send({ message: 'Notifications retrieved!', notifications })

})

export { router as getAllNotificationRouter }