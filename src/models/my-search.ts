import { Model, Document, Schema, model } from "mongoose";


interface MySearchAttrs {
    user: string;

    date: string;
    state: string;
    room_type: string;
    budget_range: string;
    city: string;
    gender: string;
    description: string;
    interests: string[];
    smokes: string;
    drinks: string;
    cleans_room: string;
    cooks: string;
    religion: string;
    partying: string;
}

interface MySearchDoc extends Document {
    user: string;

    date: string;
    state: string;
    room_type: string;
    budget_range: string;
    city: string;
    gender: string;
    description: string;
    interests: string[];
    smokes: string;
    drinks: string;
    cleans_room: string;
    cooks: string;
    religion: string;
    partying: string;
}

interface MySearchModel extends Model<MySearchDoc> {
    build(attrs: MySearchAttrs): MySearchDoc;
}

const mySearchSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    date: {
        type: Date
    },
    state: {
        type: String,
    },
    room_type: {
        type: String,
    },
    budget_range: {
        type: String,
    },
    city: {
        type: String,
    },
    gender: {
        type: String,
    },
    description: {
        type: String,
    },
    interests: {
        type: String,
    },
    smokes: {
        type: String,
    },
    drinks: {
        type: String,
    },
    cleans_room: {
        type: String,
    },
    cooks: {
        type: String,
    },
    religion: {
        type: String,
    },
    partying: {
        type: String,
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

mySearchSchema.statics.build = (attrs: MySearchAttrs) => {
    return new MySearch(attrs);
}

const MySearch = model<MySearchDoc, MySearchModel>('MySearch', mySearchSchema)

export { MySearch, MySearchDoc }
