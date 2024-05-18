import { Model, Document, Schema, model } from "mongoose";
import { CheckInMode } from "../types/checkin-mode";

interface CheckInAttrs {
    checkin_date: string;
    checkout_date?: string;
    checkin_mode: CheckInMode;
    roommate_agreement?: string;
    roommates: string[];
    is_active?: boolean;
    address?: string;
    moving_to?: string;

}

interface CheckInDoc extends Document {
    checkin_date: string;
    checkout_date?: string;
    checkin_mode: CheckInMode;
    roommate_agreement?: string;
    roommates: string[];
    is_active?: boolean;
    address?: string;
    moving_to?: string;

}

interface CheckInModel extends Model<CheckInDoc> {
    build(attrs: CheckInAttrs): CheckInDoc;
}

const checkInSchema = new Schema({
    checkin_date: {
        type: Date,
        required: true
    },
    checkout_date: {
        type: Date,
    },
    address: {
        type: String,
    },
    moving_to: {
        type: String,
    },

    checkin_mode: {
        type: String,
        required: true,
        enum: Object.values(CheckInMode),

    },

    is_active: {
        type: Boolean,
        default: true
    },

    roommate_agreement: {
        type: Schema.Types.ObjectId,
        ref: 'RoommateAgreement',
    },
    roommates: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

checkInSchema.statics.build = (attrs: CheckInAttrs) => {
    return new CheckIn(attrs);
}

const CheckIn = model<CheckInDoc, CheckInModel>('CheckIn', checkInSchema)

export { CheckIn, CheckInDoc }
