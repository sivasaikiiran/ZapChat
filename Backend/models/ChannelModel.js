import mongoose, { Schema } from 'mongoose'

const channelSchema = new Schema({
    channelName: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        required: true,
        ref: 'user'
    },
    members: [{ type: String, required: true, ref: 'user' }]
});

const ChannelModel = mongoose.model('channel', channelSchema);

export default ChannelModel;