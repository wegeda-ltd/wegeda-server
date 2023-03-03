import { Model, Document, Schema, model } from "mongoose";


interface ListingSubscriptionAttrs {
    subscription_title: string;
    subscription_price: number;
    total_listing: number
}

interface ListingSubscriptionDoc extends Document {
    subscription_title: string;
    subscription_price: number;
    total_listing: number
}

interface ListingSubscriptionModel extends Model<ListingSubscriptionDoc> {
    build(attrs: ListingSubscriptionAttrs): ListingSubscriptionDoc;
}

const listingSubscriptionSchema = new Schema({
    subscription_title: {
        type: String,
        required: true
    },
    subscription_price: {
        type: Number,
        required: true
    },
    total_listing: {
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

listingSubscriptionSchema.statics.build = (attrs: ListingSubscriptionAttrs) => {
    return new ListingSubscription(attrs);
}

const ListingSubscription = model<ListingSubscriptionDoc, ListingSubscriptionModel>('Listing-Subscription', listingSubscriptionSchema)

export { ListingSubscription, ListingSubscriptionDoc }
