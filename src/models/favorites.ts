import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';
import { FavoriteType, UserType } from "../types";

interface FavoriteAttrs {
    favorite_roommate?: string;
    favorite_room?: string;
    user: string;
    favorite_type: FavoriteType


}

interface FavoriteDoc extends Document {
    favorite_roommate?: string;
    favorite_room?: string;
    user: string;
    favorite_type: FavoriteType
    createdAt: string;
    updatedAt: string;

}

interface FavoriteModel extends PaginateModel<FavoriteDoc> {
    build(attrs: FavoriteAttrs): FavoriteDoc;
}

const favoriteSchema = new Schema({
    favorite_roommate: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    favorite_room: {
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favorite_type: {
        type: String,
        required: true,
        enum: Object.values(FavoriteType),
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

