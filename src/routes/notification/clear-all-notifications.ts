import { Request, Response, Router } from "express";
import { currentUser, requireAuth, } from "../../middlewares";
import { Notification } from "../../models";

const router = Router()

router.delete("/api/notification/clear-all", currentUser, requireAuth, async (req: Request, res: Response) => {


    await Notification.deleteMany({
        user: req.currentUser!.id
    })


    res.status(201).send({ message: 'Notifications cleared!', })

})

export { router as clearAllNotificationsRouter }