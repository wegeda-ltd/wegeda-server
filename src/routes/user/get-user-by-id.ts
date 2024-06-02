import { Router } from 'express';
import { NotFoundError } from '../../errors';
import { currentUser, requireAuth } from '../../middlewares';
import { HouseSeeker, Agent, Verification, User } from '../../models';
import { UserType } from '../../types';

const router = Router()

router.get("/api/users/:id",
    // currentUser, 
    // requireAuth, 
    async (req, res) => {
        const user = await User.findById(req.params.id)

        if (!user) {
            throw new NotFoundError("User not found")
        }
        let thisUser;
        let verifications;
        if (user.profile_type == UserType.HouseSeeker) {
            thisUser = await HouseSeeker.findOne({ user: user.id }).populate("user")
            verifications = await Verification.findOne({ user: user.id })

        } else {
            thisUser = await Agent.findOne({ user: user.id }).populate("user")

        }
        res.send({ currentUser: thisUser, verifications })


    })

export { router as getUserByIdRouter }