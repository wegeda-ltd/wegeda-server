import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { Admin } from "../../models";
import { NotAuthorizedError } from "../../errors";
import { Password } from "../../services/password";
import jwt from "jsonwebtoken";


const router = Router();

router.post(
    "/api/admin/login",
    [
        body("email")
            .isEmail()
            .withMessage("Enter your email"),
        body("password").notEmpty().withMessage("Enter your password"),

    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })

        if (!admin) {
            throw new NotAuthorizedError("Invalid Credentials")
        }


        const passwordMatch = await Password.compare(
            admin.password,
            password
        )

        if (!passwordMatch) {
            throw new NotAuthorizedError("Invalid Credentials")
        }

        const userJwt = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                phone_number: '0800000000',
                profile_type: 'Admin'
            },
            process.env.JWT_KEY!
        );

        res.status(200).send({
            status: true,
            message: "Signedin successfully",
            data: {
                token: userJwt,
                admin

            }
        })



    });


export { router as adminLoginRouter }