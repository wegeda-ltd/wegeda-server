import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

interface ChatMessageAttrs {
    text?: string;
    from: string;
    group: string;
    images?: string[];
    read_by: string[];
    is_edited?:boolean;
    is_deleted?:boolean;

}

interface ChatMessageDoc extends Document {
    text?: string;
    from: string;
    group: string;
    images?: string[];
    read_by: string[];
    is_edited?:boolean;
    is_deleted?:boolean;
    createdAt: string;
    updatedAt: string;

}

interface ChatMessageModel extends PaginateModel<ChatMessageDoc> {
    build(attrs: ChatMessageAttrs): ChatMessageDoc;
}

const chatMessageSchema = new Schema({
    text: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default:false
    },
    is_edited: {
        type: Boolean,
        default:false
    },
    read_by: [{
        type: String,
    }],
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Chat-Group',
        required: true

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

