import mongoose from "mongoose"

const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    friendConnections: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" }]
})

const friendModel = mongoose.model('friend', friendSchema);

export default friendModel;