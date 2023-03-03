import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

interface ChatGroupAttrs {
    user_1: string;
    user_2: string;
    messages?: string[];

}

interface ChatGroupDoc extends Document {
    user_1: string;
    user_2: string;
    messages?: string[];

    createdAt: string;
    updatedAt: string;

}

interface ChatGroupModel extends PaginateModel<ChatGroupDoc> {
    build(attrs: ChatGroupAttrs): ChatGroupDoc;
}

const chatGroupSchema = new Schema({
    user_1: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    user_2: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'ChatMessage'
    }]

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    timestamps: true
})

chatGroupSchema.statics.build = (attrs: ChatGroupAttrs) => {
    return new ChatGroup(attrs);
}


chatGroupSchema.plugin(paginate)
const ChatGroup = model<ChatGroupDoc, ChatGroupModel>('Chat-Group', chatGroupSchema)


export { ChatGroup, ChatGroupDoc }

