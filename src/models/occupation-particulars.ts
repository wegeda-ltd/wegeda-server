import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

interface OccupationParticularAttrs {
    user: string;
    occupation_particulars: string[]
}

interface OccupationParticularDoc extends Document {
    user: string;
    occupation_particulars: string[]
}

interface OccupationParticularModel extends PaginateModel<OccupationParticularDoc> {
    build(attrs: OccupationParticularAttrs): OccupationParticularDoc;
}

const occupationParticularSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    occupation_particulars: [
        {
            type: String
        }
    ]
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

occupationParticularSchema.statics.build = (attrs: OccupationParticularAttrs) => {
    return new OccupationParticular(attrs);
}

occupationParticularSchema.plugin(paginate)

const OccupationParticular = model<OccupationParticularDoc, OccupationParticularModel>('Occupation-Particular', occupationParticularSchema)


export { OccupationParticular, OccupationParticularDoc }

