import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

interface ChatGroupAttrs {
    users: string[];
    messages?: string[];
    admins?: string[];
    name: string;
    isGroup?: boolean;
}

interface ChatGroupDoc extends Document {
    users: string[];
    messages?: string[];
    admins?: string[];
    isGroup: boolean
    name: string;
    createdAt: string;
    updatedAt: string;

}

interface ChatGroupModel extends PaginateModel<ChatGroupDoc> {
    build(attrs: ChatGroupAttrs): ChatGroupDoc;
}

const chatGroupSchema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User',

    }],
    name: {
        type: String,
        required: true
    },
    isGroup: {
        type: Boolean,
        default: false
    },

    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat-Message'
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

