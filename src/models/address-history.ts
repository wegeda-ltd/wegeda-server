import { Model, Document, Schema, model, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

// An interface that describes the properties
// that are required to create a new Address
interface AddressAttrs {
    address_line1: string;
    address_line2?: string;
    lga: string;
    state: string;
    country?: string;
    postal_code?: string;
    landlord_name: string;
    landlord_phone_number: string;
    problems_with_landlord: boolean;

}

const addressSchema = new Schema({
    address_line1: {
        type: String,
        trim: true,
        required: true
    },
    address_line2: {
        type: String,
        trim: true,
    },
    lga: {
        type: String,
        trim: true,
        required: true
    },
    state: {
        type: String,
        trim: true,
        required: true
    },
    country: {
        type: String,
        trim: true,
        default: "Nigeria"
    },
    postal_code: {
        type: String,
        trim: true
    },
    landlord_name: {
        type: String,
        trim: true
    },
    landlord_phone_number: {
        type: String,

    },
    problems_with_prev_landlord: {
        type: Boolean
    },

})


interface AddressHistoryAttrs {
    user: string;
    current_address: AddressAttrs;
    prev_address: AddressAttrs;
}

interface AddressHistoryDoc extends Document {
    user: string;
    current_address: AddressAttrs;
    prev_address: AddressAttrs;
}

interface AddressHistoryModel extends PaginateModel<AddressHistoryDoc> {
    build(attrs: AddressHistoryAttrs): AddressHistoryDoc;
}

const addressHistorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    current_address: {
        type: addressSchema,
        required: true

    },
    prev_address: addressSchema,
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

addressHistorySchema.statics.build = (attrs: AddressHistoryAttrs) => {
    return new AddressHistory(attrs);
}
addressHistorySchema.plugin(paginate);
const AddressHistory = model<AddressHistoryDoc, AddressHistoryModel>('Address-History', addressHistorySchema)


export { AddressHistory, AddressHistoryDoc }

