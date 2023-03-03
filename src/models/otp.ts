import { Model, Document, Schema, model, ObjectId } from "mongoose";
import { UserType } from "../types";

// An interface that describes the properties
// that are required to create a new User
interface OtpAttrs {
    email?: string;
    phone_number?: string;
    otp: string
}

interface OtpDoc extends Document {
    email?: string;
    phone_number?: string;
    otp: string;
}

interface UserModel extends Model<OtpDoc> {
    build(attrs: OtpAttrs): OtpDoc;
}

const otpSchema = new Schema({
    email: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now, index: { expireAfterSeconds: 300 } }


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

otpSchema.statics.build = (attrs: OtpAttrs) => {
    return new Otp(attrs);
}

const Otp = model<OtpDoc, UserModel>('Otp', otpSchema)


export { Otp, OtpDoc }

