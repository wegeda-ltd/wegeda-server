import { Router } from 'express';
import { currentUser } from '../../middlewares';
import { HouseSeeker, Agent, Verification } from '../../models';
import { UserType } from '../../types';

const router = Router()

router.get("/api/users/current-user", currentUser, async (req, res) => {

    if (req.currentUser) {
        let user;
        let verifications;
        if (req.currentUser.profile_type === UserType.HouseSeeker) {
            user = await HouseSeeker.findOne({ user: req.currentUser.id }).populate("user")
            verifications = await Verification.findOne({ user: req.currentUser.id })
        } else {
            user = await Agent.findOne({ user: req.currentUser.id }).populate("user")

        }
        res.send({ currentUser: user ? user : req.currentUser, verifications })
    } else {
        res.send({ currentUser: null })
    }

})

export { router as currentUserRouter }