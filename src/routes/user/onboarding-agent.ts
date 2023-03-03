import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { Agent, User } from "../../models";
import { UserType } from "../../types";
import jwt from 'jsonwebtoken';


const router = Router()

router.post("/api/users/onboarding-agent", currentUser, requireAuth, [
    body('first_name').trim().isLength({ min: 2 }).withMessage('first name is a required field'),
    body('last_name').trim().isLength({ min: 2 }).withMessage('last name is a required field'),
    body('license_id').isArray({ min: 2 }).withMessage('upload images of your license id'),
    body('agent_type').trim().notEmpty().withMessage('please select agent type'),
    body('about_organization').trim().notEmpty().withMessage('tell us about your organization'),
    body('organization_name').trim().notEmpty().withMessage('what is your organization name?'),
], validateRequest, async (req: Request, res: Response) => {
    let {
        first_name,
        last_name,
        license_id,
        agent_type,
        about_organization,
        organization_name
    } = req.body

    const current_user = await User.findById(req.currentUser?.id)

    if (!current_user) {
        return
    }

    current_user.set({
        first_name,
        last_name,
        profile_type: UserType.Agent
    })

    await current_user.save()

    let userJwt = jwt.sign({
        id: current_user!._id,
        email: current_user!.email,
        phone_number: current_user!.phone_number,
        profile_type: current_user!.profile_type
    }, process.env.JWT_KEY!)

    req.session = {
        jwt: userJwt
    }


    const agent = Agent.build({
        user: current_user.id,
        agent_type,
        organization_name,
        about_organization,
        license_id
    })

    await agent.save()
    res.status(200).send({ message: 'Congratulations on successfully completing your profile' })
})

export { router as onboardingAgentRouter }