import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { Admin } from "../../models";
import { BadRequestError, NotAuthorizedError } from "../../errors";
import { Password } from "../../services/password";
import jwt from "jsonwebtoken";


const router = Router();

router.post(
    "/api/admin/create",
    // [
    //     body("email")
    //         .isEmail()
    //         .withMessage("Enter your email"),
    //     body("password").notEmpty().withMessage("Enter your password"),

    // ],
    // validateRequest,
    async (req: Request, res: Response) => {

        const admin = await Admin.findOne({ email: req.body.email })

        if (admin) {
            throw new BadRequestError("Admin with email already exists")
        }


        const newAdmin = Admin.build({
            ...req.body
        })

        await newAdmin.save()

        const userJwt = jwt.sign(
            {
                id: newAdmin._id,
                email: newAdmin.email,
                phone_number: '080000000'
            },
            process.env.JWT_KEY!
        );

        res.status(200).send({
            status: true,
            message: "Admin created successfully",
            data: {
                token: userJwt

            }
        })



    });


export { router as createAdminRouter }