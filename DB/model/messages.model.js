import { Schema, model, Types } from "mongoose";

let messagesSchema = new Schema({

    content: { required: true, type: String },
    images: {
        type: [String],
    },
    date: { type: String, default: new Date().toLocaleDateString("en") },
    time: {
        type: String, default: new Date().toLocaleTimeString("en-US", {
            hour12: false
        })
    },
    sender: {
        type: Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    receiver: {
        type: Types.ObjectId,
        required: true,
        refPath: 'receiverModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Store']
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User', 'Store']
    },
    chatId: {
        type: Types.ObjectId,
        ref: "Chat",
    }
})
const messagesModel = model('Message', messagesSchema);
export default messagesModel
