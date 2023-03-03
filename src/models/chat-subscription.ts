import { Model, Document, Schema, model } from "mongoose";

interface ChatSubscriptionAttrs {
    subscription_title: string;
    subscription_price: number;
    subscription_maximum_chat: number;

}

interface ChatSubscriptionDoc extends Document {
    subscription_title: string;
    subscription_price: number;
    subscription_maximum_chat: number;

}

interface ChatSubscriptionModel extends Model<ChatSubscriptionDoc> {
    build(attrs: ChatSubscriptionAttrs): ChatSubscriptionDoc;
}

const chatSubscriptionSchema = new Schema({
    subscription_title: {
        type: String,
        required: true
    },
    subscription_price: {
        type: Number,
        required: true
    },
    subscription_maximum_chat: {
        type: Number,
        required: true

    },
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

chatSubscriptionSchema.statics.build = (attrs: ChatSubscriptionAttrs) => {
    return new ChatSubscription(attrs);
}


const ChatSubscription = model<ChatSubscriptionDoc, ChatSubscriptionModel>('Chat-Subscription', chatSubscriptionSchema)

export { ChatSubscription, ChatSubscriptionDoc }
