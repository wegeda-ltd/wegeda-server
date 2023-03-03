import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

interface ChatMessageAttrs {
    text?: string;
    images?: string[];
    chat_group: string;
    is_read?: boolean;

}

interface ChatMessageDoc extends Document {
    text?: string;
    images?: string[];
    chat_group: string;
    is_read?: boolean;
    createdAt: string;
    updatedAt: string;

}

interface ChatMessageModel extends PaginateModel<ChatMessageDoc> {
    build(attrs: ChatMessageAttrs): ChatMessageDoc;
}

const chatMessageSchema = new Schema({
    chat_group: {
        type: Schema.Types.ObjectId,
        ref: 'ChatGroup',
        required: true
    },

    text: {
        type: String,
    },
    is_read: {
        type: Boolean,
    },
    images: [{
        type: String,
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

chatMessageSchema.statics.build = (attrs: ChatMessageAttrs) => {
    return new ChatMessage(attrs);
}


chatMessageSchema.plugin(paginate)
const ChatMessage = model<ChatMessageDoc, ChatMessageModel>('Chat-Message', chatMessageSchema)


export { ChatMessage, ChatMessageDoc }

