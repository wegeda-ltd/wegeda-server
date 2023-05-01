import { Model, Document, Schema, model } from "mongoose";
import { SubscriptionType } from "../types";


interface PaymentAttrs {
    user: string;
    reference: string;
    subscription_type: SubscriptionType;
    subscription_id: string;
    subscription_price: number;
    duration: number;

}

interface PaymentDoc extends Document {
    user: string;
    reference: string;
    subscription_type: SubscriptionType;
    subscription_id: string;
    subscription_price: number;
    createdAt: string;
    duration: number;

}

interface PaymentModel extends Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    subscription_type: {
        type: String,
        required: true,
        enum: Object.values(SubscriptionType),
    },
    subscription_price: {
        type: Number,
        required: true
    },
    subscription_id: {
        type: String,
        required: true

    },
    duration: {
        type: Number,
        required: true
    }
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
}

const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export { Payment, PaymentDoc }
