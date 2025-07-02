import mongoose, { Schema } from "mongoose";

const channelMessageSchema = new Schema({
    channelId: {
        type: String,
        required: true,
        ref: 'channel'
    },
    sender: {
        type: String,
        required: true,
        ref: 'user'
    },
    messageType: {
        type: String,
        enum: ['text', 'file'],
        required: true
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file"
        }
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text"
        }
    }
}, { timestamps: true })

const channelMessageModel = mongoose.model('channelMessage', channelMessageSchema);

export default channelMessageModel;