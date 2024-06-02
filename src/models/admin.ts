import { Model, Document, Schema, model, PaginateModel } from "mongoose";
import { Password } from "../services/password";



interface AdminAttrs {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    profile_image?: string;

}

interface AdminDoc extends Document {
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: string;
    password: string;


}

interface AdminModel extends PaginateModel<AdminDoc> {
    build(attrs: AdminAttrs): AdminDoc;
}

const adminSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        default: "https://res.cloudinary.com/diils/image/upload/v1677774465/wegeda/user_male_wpb9rn.png"
    },

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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

adminSchema.statics.build = (attrs: AdminAttrs) => {
    return new Admin(attrs);
}



adminSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashedPassword = await Password.toHash(this.get("password"))
        this.set("password", hashedPassword);
    }
    done();
});

adminSchema.statics.build = (attrs: AdminAttrs) => {
    return new Admin(attrs);
}

const Admin = model<AdminDoc, AdminModel>('Admin', adminSchema)


export { Admin, AdminDoc }

