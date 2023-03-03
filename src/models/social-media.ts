import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

interface SocialAttrs {
    social: string;
    username: string;
}

const socialSchema = new Schema({
    social: {
        type: String,
        trim: true,
        required: true
    },
    username: {
        type: String,
        trim: true,
    },
})


interface SocialMediaAttrs {
    user: string;
    social_media: SocialAttrs[]
}

interface SocialMediaDoc extends Document {
    user: string;
    social_media: SocialAttrs[]
}

interface SocialMediaModel extends PaginateModel<SocialMediaDoc> {
    build(attrs: SocialMediaAttrs): SocialMediaDoc;
}

const socialMediaSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    social_media: [socialSchema]

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

socialMediaSchema.statics.build = (attrs: SocialMediaAttrs) => {
    return new SocialMedia(attrs);
}

socialMediaSchema.plugin(paginate)

const SocialMedia = model<SocialMediaDoc, SocialMediaModel>('Social-Media', socialMediaSchema)


export { SocialMedia, SocialMediaDoc }

