import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';
import { UserType } from "../types";

interface FavoriteAttrs {
    listing: string;
    user: string;
    listing_type: UserType;


}

interface FavoriteDoc extends Document {
    listing: string;
    user: string;
    listing_type: UserType;
    createdAt: string;
    updatedAt: string;

}

interface FavoriteModel extends PaginateModel<FavoriteDoc> {
    build(attrs: FavoriteAttrs): FavoriteDoc;
}

const favoriteSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

favoriteSchema.statics.build = (attrs: FavoriteAttrs) => {
    return new Favorite(attrs);
}


favoriteSchema.plugin(paginate)
const Favorite = model<FavoriteDoc, FavoriteModel>('Favorite', favoriteSchema)


export { Favorite, FavoriteDoc }

