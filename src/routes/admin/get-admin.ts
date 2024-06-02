import { Router } from "express";
import { currentUser, requireAuth } from "../../middlewares";
import { Admin } from "../../models";

const router = Router();

router.get("/api/admin/current-admin",
    currentUser,
    requireAuth,
    async (req, res) => {

        if (req.currentUser) {
            const admin = await Admin.findById(req.currentUser.id)




            res.send({ admin });
        } else {
            res.send({ admin: null });
        }
    });

export { router as getCurrentAdminRouter };
