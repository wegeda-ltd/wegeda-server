import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

interface NinAttrs {
    user: string;
    nin: number
}

interface NinDoc extends Document {
    user: string;
    nin: number
}

interface NinModel extends PaginateModel<NinDoc> {
    build(attrs: NinAttrs): NinDoc;
}

const ninSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nin:
    {
        type: Number
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

ninSchema.statics.build = (attrs: NinAttrs) => {
    return new Nin(attrs);
}


ninSchema.plugin(paginate)
const Nin = model<NinDoc, NinModel>('Nin', ninSchema)


export { Nin, NinDoc }

