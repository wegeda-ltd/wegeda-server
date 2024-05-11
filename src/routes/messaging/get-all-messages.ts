import { Request, Response, Router } from "express";
import { currentUser, requireAuth, } from "../../middlewares";
import { ChatGroup, ChatMessage } from "../../models";
import { BadRequestError } from "../../errors";

const router = Router();
export const getAllMessages = async (req:Request)=> {
    const pageSize: any = req.query.pageSize || 10
    const page: any = req.query.page || 1
    const skip = (page - 1) * pageSize;

    const messages = await ChatGroup.find({
        users: req.currentUser!.id,
        type: 'chat'
    }).populate({
        path: "messages",
        options: { sort: { createdAt: -1 } }
    }).populate({ path: "users", select: 'first_name last_name profile_image status' }).sort({ createdAt: -1 })
        .skip(skip).limit(pageSize)

        let unread = 0;
         
        for(let [index, msg] of messages.entries()){
            let inner_unread = 0
            if(msg.messages){
                for(let m of msg.messages){
                    // @ts-ignore
                    if(!m.read_by.includes(req.currentUser?.id)){
                        unread++
                        inner_unread++
                    }
                   
                }
              
            }
            

               // @ts-ignore
               messages[index]['unread'] = inner_unread
          
        }

        
    const totalMsgs = await ChatGroup.countDocuments({ users: req.currentUser!.id });
    const totalPages = Math.ceil(totalMsgs / pageSize);
    const nextPage = totalPages > page ? page + 1 : null;

    return {
        messages,
        unread,
        pagination: {
            currentPage: page,
            totalPages,
            nextPage
        }
    }


}
router.get(
    "/api/messages",
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {

        const {messages, unread, pagination} =  await getAllMessages(req)

        
// @ts-ignore
        return res.send({
            message: "Messages retrieved",
            messages,
            unread,
             pagination
        })
    }
);

export { router as getMessagesRouter };
