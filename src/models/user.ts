import { Model, Document, Schema, model, PaginateModel } from "mongoose";
import { UserType } from "../types";
import paginate from 'mongoose-paginate-v2';

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    profile_type: UserType;
    profile_image: string;
}

interface UserDoc extends Document {
    first_name: string;
    last_name: string;
    email: string;
    profile_image: string;
    phone_number: string;
    profile_type: UserType;

}

interface UserModel extends PaginateModel<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    profile_type: {
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

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}


userSchema.plugin(paginate)
const User = model<UserDoc, UserModel>('User', userSchema)


export { User, UserDoc }

