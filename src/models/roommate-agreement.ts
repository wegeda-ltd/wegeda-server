import { Model, Document, Schema, model } from "mongoose";
import { CheckInMode } from "../types/checkin-mode";

interface RoommateAgreementAttrs {
    checkin_date: string;
    checkout_date?: string;
    checkin_mode: CheckInMode;

    payment_ref: string;
    roommates: string[];
    downloaded_by?: string[];
    uploaded?: boolean;
    fileName?: string;

}

interface RoommateAgreementDoc extends Document {
    checkin_date: string;
    checkout_date?: string;
    checkin_mode: CheckInMode;

    payment_ref: string;
    roommates: string[];
    downloaded_by?: string[];
    uploaded?: boolean;
    fileName?: string;


}

interface RoommateAgreementModel extends Model<RoommateAgreementDoc> {
    build(attrs: RoommateAgreementAttrs): RoommateAgreementDoc;
}

const roommateAgreementSchema = new Schema({
    checkin_date: {
        type: Date,
        required: true
    },
    checkout_date: {
        type: Date,
    },

    checkin_mode: {
        type: String,
        required: true,
        enum: Object.values(CheckInMode),

    },
    payment_ref: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
    },
    uploaded: {
        type: Boolean,
        default: false
    },

    roommates: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    downloaded_by: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],

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

roommateAgreementSchema.statics.build = (attrs: RoommateAgreementAttrs) => {
    return new RoommateAgreement(attrs);
}

const RoommateAgreement = model<RoommateAgreementDoc, RoommateAgreementModel>('RoommateAgreement', roommateAgreementSchema)

export { RoommateAgreement, RoommateAgreementDoc }
