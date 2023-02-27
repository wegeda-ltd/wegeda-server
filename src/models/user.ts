import { Model, Document, Schema, model, ObjectId } from "mongoose";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    organization?: ObjectId
}
