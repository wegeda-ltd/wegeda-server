import { Document, Schema, model, PaginateModel } from "mongoose";
import paginate from 'mongoose-paginate-v2';

interface NotificationAttrs {
    user: string;
    notification_image?: string;
    notification_message: string;
    notification_route?: string;
    notification_route_label?: string;
    is_read?: boolean;
}

interface NotificationDoc extends Document {
    user: string;
    notification_image?: string;
    notification_message: string;
    notification_route?: string;
    notification_route_label?: string;
    is_read?: boolean;
}

interface NotificationModel extends PaginateModel<NotificationDoc> {
    build(attrs: NotificationAttrs): NotificationDoc;
}

const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    notification_image: {
        type: String,

    },
    notification_message: {
        type: String,
        trim: true
    },
    notification_route: {
        type: String,
    },
    notification_route_label: {
        type: String,
    },
    is_read: {
        type: Boolean,
        default: false
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

notificationSchema.statics.build = (attrs: NotificationAttrs) => {
    return new Notification(attrs);
}


notificationSchema.plugin(paginate)

const Notification = model<NotificationDoc, NotificationModel>('Notification', notificationSchema)

export { Notification, NotificationDoc }
