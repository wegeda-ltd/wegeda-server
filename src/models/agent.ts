import { Document, Schema, model, PaginateModel } from "mongoose";
import { AgentType } from "../types";
import paginate from 'mongoose-paginate-v2';

// An interface that describes the properties
// that are required to create a new Agent
interface AgentAttrs {
    user: string;
    agent_type: AgentType;
    organization_name: string;
    about_organization: string;
    profile_image?: string;
    license_id: string[]
}

interface AgentDoc extends Document {
    user: string;
    agent_type: AgentType;
    organization_name: string;
    about_organization: string;
    profile_image?: string;
    license_id: string[]
}

interface AgentModel extends PaginateModel<AgentDoc> {
    build(attrs: AgentAttrs): AgentDoc;
}

const agentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    organization_name: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        default: "https://res.cloudinary.com/diils/image/upload/v1677774465/wegeda/user_male_wpb9rn.png"
    },
    about_organization: {
        type: String,
        required: true
    },
    agent_type: {
        type: String,
        required: true,
        enum: Object.values(AgentType),
    },
    license_id: [{
        type: String,
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

agentSchema.statics.build = (attrs: AgentAttrs) => {
    return new Agent(attrs);
}

agentSchema.plugin(paginate);

const Agent = model<AgentDoc, AgentModel>('Agent', agentSchema)

export { Agent, AgentDoc }

