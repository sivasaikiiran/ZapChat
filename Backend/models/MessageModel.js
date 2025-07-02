import mongoose from "mongoose"
const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
        ref: "user"
    },
    recipent: {
        type: String,
        required: true,
        ref: "user"
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text"
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file"
        }
    },
    delivered: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const MessageModel = mongoose.model('message', messageSchema);


export default MessageModel;