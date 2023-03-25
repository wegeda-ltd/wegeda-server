import { Model, Document, Schema, model, PaginateModel } from "mongoose";
import { GenderType } from "../types";
import paginate from 'mongoose-paginate-v2';

// An interface that describes the properties
// that are required to create a new HouseSeeker
interface HouseSeekerAttrs {
    user: string;
    date_of_birth: string;
    about: string;
    gender: GenderType;
    tertiary_institution?: string;
    church?: string;
    orientation_camp?: string;
    cooks: string;
    religion: string;
    partying: string;
    occupation: string;
    company?: string;
    description: string[];
    interests: string[];
    pets?: string[];
    smokes: string;
    drinks: string;
    cleans_room: string;
    profile_image: string;
    gallery_images?: string[];
    budget?: number[];
}

interface HouseSeekerDoc extends Document {
    user: string;
    date_of_birth: string;
    about: string;
    gender: GenderType;
    tertiary_institution?: string;
    church?: string;
    orientation_camp?: string;
    cooks: string;
    religion: string;
    partying: string;
    occupation: string;
    company?: string;
    description: string[];
    interests: string[];
    pets?: string[];
    smokes: string;
    drinks: string;
    cleans_room: string;
    profile_image: string;
    gallery_images?: string[];
    budget?: number[];
}

interface HouseSeekerModel extends PaginateModel<HouseSeekerDoc> {
    build(attrs: HouseSeekerAttrs): HouseSeekerDoc;
}

const houseSeekerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    cooks: {
        type: String,
        required: true
    },
    religion: {
        type: String,
        required: true
    },
    partying: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: Object.values(GenderType),
    },
    tertiary_institution: {
        type: String,
    },
    church: {
        type: String
    },
    orientation_camp: {
        type: String
    },
    occupation: {
        required: true,
        type: String
    },
    company: {
        required: true,
        type: String
    },
    description: [{
        type: String
    }],
    budget: [{
        type: String
    }],
    interests: [{
        type: String
    }],
    pets: [{
        type: String
    }],
    smokes: {
        type: String,
        required: true
    },
    drinks: {
        type: String,
        required: true
    },
    cleans_room: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        required: true
    },
    gallery_images: [{
        type: String
    }]
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

houseSeekerSchema.statics.build = (attrs: HouseSeekerAttrs) => {
    return new HouseSeeker(attrs);
}

houseSeekerSchema.plugin(paginate)

const HouseSeeker = model<HouseSeekerDoc, HouseSeekerModel>('House-Seeker', houseSeekerSchema)


export { HouseSeeker, HouseSeekerDoc }

