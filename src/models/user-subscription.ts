import { Model, Document, Schema, model } from "mongoose";

interface UserSubscriptionAttrs {
    user: string;
    subscription: string;
    amount_left: number;
    expiry_date: string;
    is_expired?: boolean;
    duration: number;
}

interface UserSubscriptionDoc extends Document {
    user: string;
    subscription: string | any;
    amount_left: number;
    expiry_date: string;
    is_expired?: boolean;
    duration: number;
}

interface UserSubscriptionModel extends Model<UserSubscriptionDoc> {
    build(attrs: UserSubscriptionAttrs): UserSubscriptionDoc;
}

const userSubscriptionSchema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount_left: {
        type: Number,
        required: true

    },
    expiry_date: {
        type: String,
        required: true
    },
    is_expired: {
        type: Boolean,
        default: false
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.subscription
        }
    },
    timestamps: true
})

userSubscriptionSchema.statics.build = (attrs: UserSubscriptionAttrs) => {
    return new UserSubscription(attrs);
}

const UserSubscription = model<UserSubscriptionDoc, UserSubscriptionModel>('User-Subscription', userSubscriptionSchema)

export { UserSubscription, UserSubscriptionDoc }
