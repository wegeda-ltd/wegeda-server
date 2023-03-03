import { Request, Response, Router } from "express";
import { currentUser, requireAuth } from "../../middlewares";
import { Agent, HouseSeeker, User } from "../../models";
import { UserType } from "../../types";

const router = Router()

router.patch("/api/users/update-user", currentUser, requireAuth, async (req: Request, res: Response) => {

    const {
        about,
        about_organization,
        descriptions,
        interests,
        partying,
        cooks,
        smokes,
        drinks,
        cleans_room,
        pets,
        profile_image,
        gallery_images,
        budget
    } = req.body
    const current_user = await User.findById(req.currentUser?.id)

    if (!current_user) {
        return
    }

    if (current_user.profile_type == UserType.HouseSeeker) {
        const user = await HouseSeeker.findOne({ user: current_user.id })
        if (!user) {
            return
        }

        user.set({
            about: about ? about : user.about,
            descriptions: descriptions ? descriptions : user.descriptions,
            interests: interests ? interests : user.interests,
            partying: partying ? partying : user.partying,
            cooks: cooks ? cooks : user.cooks,
            smokes: smokes ? smokes : user.smokes,
            drinks: drinks ? drinks : user.drinks,
            pets: pets ? pets : user.pets,
            cleans_room: cleans_room ? cleans_room : user.cleans_room,
            budget: budget ? budget : user.budget,
            profile_image: profile_image ? profile_image : user.profile_image,
            gallery_images: gallery_images ? gallery_images : user.gallery_images
        })

        await user.save()

    } else if (current_user.profile_type == UserType.Agent) {
        const user = await Agent.findOne({ user: current_user.id })
        if (!user) {
            return
        }
        user.set({
            profile_image: profile_image ? profile_image : user.profile_image,
            about_organization: about_organization ? about_organization : user.about_organization
        })

        await user.save()
    }

    res.status(200).send({ message: 'Profile updated' })
})

export { router as updateUserRouter }