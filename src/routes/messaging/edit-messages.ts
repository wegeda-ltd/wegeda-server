import { Request, Response, Router } from "express";
import { currentUser, requireAuth, validateRequest } from "../../middlewares";
import { body } from "express-validator";
import { ChatMessage } from "../../models";

const router = Router()

router.patch(
    "/api/messages/:id",
    currentUser,
    requireAuth,
    [
        body("text").notEmpty().withMessage("Enter your message"),
    ],
    validateRequest,
    async (req:Request, res:Response)=>{
        const {text} = req.body;


        const message = await ChatMessage.findById(req.params.id);

        
        if(!message){
           return res.status(200).send({message: ''})
        }

        message.group

        message.set({
            text,
            is_edited:true
        })

        await message.save()
        
        const chat = await ChatMessage.find({
            group: message.group
        }).populate("from")
            .populate({
                path: "group",
                select: "users",
                populate: {
                    path: "users",
                    select: "status"
                }


            }).sort({ createdAt: -1 })
            .skip((1)).limit(12)

            const totalMsgs = await ChatMessage.countDocuments({
                group: message.group
            });
            const totalPages = Math.ceil(totalMsgs / 12);
            const nextPage = totalPages > 1 ? 1 + 1 : null;
    
            const result = {
                chat:chat.reverse(),
                group:message.group,
                pagination:{
                    pageSize:12,
                    currentPage:1,
                    totalPages,
                    nextPage
                }
            }

        req.io.emit("chats", result)
        

        return res.status(200).send({message: '',...result })
      
    }
)


export {router as editMessageRouter}