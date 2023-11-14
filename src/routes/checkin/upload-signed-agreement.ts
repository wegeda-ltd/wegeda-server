import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { User, } from "../../models";
import { BadRequestError, ServerError } from "../../errors";
import { Payment } from "../../services";
import { RoommateAgreement } from "../../models/roommate-agreement";
import multer from 'multer';
import path from "path";
import fs from 'fs'

const router = Router();

let fileName = '';
const uploadFolder = path.join(__dirname, '../../uploads/roommate-agreement');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        fileName = file.originalname.replace(' ', '-').toLowerCase().replace('.pdf', '') + '-' + uniqueSuffix + path.extname(file.originalname)
        cb(null, fileName);
    },
});
const upload = multer({ storage })
router.post(
    "/api/checkin/upload",
    currentUser,
    requireAuth,
    upload.single('file'),

    async (req: Request, res: Response) => {
        const file = req.file;
        const {
            roommates,
        } = req.body;

        if (!file) {
            throw new BadRequestError("Please upload your roommate agreement form")
        }
        const agreement = await RoommateAgreement.findOne({
            roommates: roommates.split(',')
        })

        const filePath = path.join(uploadFolder, fileName)

        if (!agreement || agreement.uploaded) {
            fs.unlink(filePath, () => {
                console.log("DONE")
            })

        }
        if (!agreement) {
            throw new BadRequestError("Please pay for the roommate agreement form")
        }
        if (agreement.uploaded) {
            throw new BadRequestError("Agreement form has already been uploaded")
        }

        agreement?.set({
            uploaded: true,
            fileName
        })

        await agreement?.save()

        return res.send({
            message: "Form uploaded",

        })

    }
);

export { router as uploadRoommateAgreementRouter };
