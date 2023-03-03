import { Model, Document, Schema, model, PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { VerificationStatus } from "../types";

// An interface that describes the properties
// that are required to create a new Verification
interface VerificationAttrs {
    user: string;
    address_history_verified?: VerificationStatus;
    income?: VerificationStatus;
    occupation_verified?: VerificationStatus;
    nin?: VerificationStatus;
    social_media?: VerificationStatus;
}

interface VerificationDoc extends Document {
    user: string;
    address_history_verified?: VerificationStatus;
    income_verified?: VerificationStatus;
    occupation_verified?: VerificationStatus;
    nin_verified?: VerificationStatus;
    social_media_verified?: VerificationStatus;
}

interface VerificationModel extends PaginateModel<VerificationDoc> {
    build(attrs: VerificationAttrs): VerificationDoc;
}

const verificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    occupation_verified: {
        type: String,
        required: true,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.Pending
    },
    address_history_verified: {
        type: String,
        required: true,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.Pending
    },
    income_verified: {
        type: String,
        required: true,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.Pending
    },
    nin_verified: {
        type: String,
        required: true,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.Pending
    },
    social_media_verified: {
        type: String,
        required: true,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.Pending
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

verificationSchema.statics.build = (attrs: VerificationAttrs) => {
    return new Verification(attrs);
}


verificationSchema.plugin(paginate)

const Verification = model<VerificationDoc, VerificationModel>('Verification', verificationSchema)


export { Verification, VerificationDoc }

