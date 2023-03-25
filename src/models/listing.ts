import { Model, Document, Schema, model, PaginateModel } from "mongoose";
import { ListingStatus, RoomType, UserType } from "../types";
import paginate from 'mongoose-paginate-v2';

interface ListingAttrs {
    user: string;
    room_type: RoomType;
    total_bedroom: number;
    total_bathroom: number;
    state: string;
    is_verified: boolean;
    city: string;
    monthly_payment: number;
    minimum_stay: number;
    about_room: string;
    listing_title: string;
    listing_features: string[];
    listing_images: string[];
    status: ListingStatus;
    on_stand_by: string[];
    listing_type: UserType;

}

interface ListingDoc extends Document {
    user: string;
    room_type: RoomType;
    total_bedroom: number;
    total_bathroom: number;
    state: string;
    city: string;
    is_verified: boolean;

    monthly_payment: number;
    minimum_stay: number;
    about_room: string;
    listing_title: string;
    listing_features: string[];
    listing_images: string[];
    status: ListingStatus;
    on_stand_by: string[];
    listing_type: UserType;


}

interface ListingModel extends PaginateModel<ListingDoc> {
    build(attrs: ListingAttrs): ListingDoc;
}

const listingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    on_stand_by: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    room_type: {
        type: String,
        required: true,
        enum: Object.values(RoomType),
    },
    total_bedroom: {
        type: Number,
        required: true
    },
    total_bathroom: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    monthly_payment: {
        type: Number,
        required: true
    },
    minimum_stay: {
        type: Number,
        required: true
    },
    is_verified: {
        type: Boolean,
        required: true
    },
    about_room: {
        type: String,
        required: true
    },
    listing_title: {
        type: String,
        required: true
    },
    listing_features: [{
        type: String,
        required: true
    }],
    listing_images: [{
        type: String,
        required: true
    }],
    listing_status: {
        type: String,
        required: true,
        enum: Object.values(ListingStatus),
        default: ListingStatus.Published
    },
    listing_type: {
        type: String,
        required: true,
        enum: Object.values(UserType),
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

listingSchema.statics.build = (attrs: ListingAttrs) => {
    return new Listing(attrs);
}


listingSchema.plugin(paginate)
const Listing = model<ListingDoc, ListingModel>('Listing', listingSchema)

export { Listing, ListingDoc }
