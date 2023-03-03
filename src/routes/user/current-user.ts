import { Router } from 'express';
import { currentUser } from '../../middlewares';

const router = Router()

router.get("/api/users/current-user", currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }