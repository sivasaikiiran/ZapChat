import MessageModel from "../models/MessageModel.js";
import friendModel from "../models/FriendModel.js";
import ChannelModel from "../models/ChannelModel.js";
import channelMessageModel from "../models/ChannelMessage.js";
import UserModel from "../models/UserModel.js";



const getChats = async (req, res, next) => {
    try {
        const { senderId, recipentId } = req.body;
        const chats = await MessageModel.find({
            $and: [
                { sender: [senderId, recipentId] },
                { recipent: [senderId, recipentId] },
            ]
        }).sort({ createdAt: 1 })

        return res.status(200).json({
            success: true,
            chatMessages: chats
        })
    } catch (error) {
        next(error)
    }
}

const getChannelChats = async (req, res, next) => {
    try {
        const { channelId } = req.body;
        const chats = await channelMessageModel.find({
            channelId
        }).populate('sender').sort({ createdAt: 1 });

        const updatedChats = chats.map((chat) => {
            const { sender, ...restDetails } = chat._doc;

            return { ...restDetails, sender: sender._id, senderName: `${sender.firstName} ${sender.lastName}` }
        })

        // const updatedChats = await Promise.all(chats.map(async (chat) => {
        //     const senderId = chat.sender;
        //     const senderDetails = await UserModel.findById(senderId);

        //     return { ...chat._doc, senderName: `${senderDetails.firstName} ${senderDetails.lastName}` }
        // }));

        // const getUser = await UserModel.findById()

        return res.status(200).json({
            success: true,
            channelMessages: updatedChats
        })
    } catch (error) {
        next(error)
    }
}

const addContact = async (req, res, next) => {
    try {
        const { userId, friendId } = req.body;

        await friendModel.updateOne(
            { userId },
            { $addToSet: { friendConnections: friendId } },
            { upsert: true }
        )

        await friendModel.updateOne(
            { userId: friendId },
            { $addToSet: { friendConnections: userId } },
            { upsert: true }
        )


        return res.status(200).json({
            success: true,
            message: "User added as friend !"
        })
    } catch (error) {
        next(error);
    }
}

const removeContact = async (req, res, next) => {
    try {
        const { userId, friendId } = req.body;

        await friendModel.updateOne(
            { userId },
            { $pull: { friendConnections: friendId } },
            { upsert: true }
        )

        await friendModel.updateOne(
            { userId: friendId },
            { $pull: { friendConnections: userId } },
            { upsert: true }
        )

        await MessageModel.deleteMany({
            $or: [
                { sender: userId, recipent: friendId },
                { sender: friendId, recipent: userId },
            ]
        })

        return res.status(200).json({
            success: true,
            message: "User removed as friend !"
        })
    } catch (error) {
        next(error);
    }
}

const getAllContacts = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const result = await friendModel.findOne({ userId }).populate('friendConnections');

        return res.status(200).json({
            success: true,
            message: "All Friends fetched !",
            friendConnections: result?.friendConnections || [],
        })
    } catch (error) {
        next(error)
    }
}

const createChannel = async (req, res, next) => {
    try {
        const { userId, members, channelName } = req.body;
        const channel = await ChannelModel.create({
            channelName,
            admin: userId,
            members: members.filter((contact) => contact._id)
        })

        return res.status(200).json({
            success: true,
            message: "Channel Created Successfully!",
            channel
        })
    } catch (error) {
        next(error)
    }
}

const getAllChannels = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const result = await ChannelModel.find({
            $or: [
                { admin: userId },
                { members: { $elemMatch: { $eq: userId } } }
            ]
        })
            .populate('members');

        return res.status(200).json({
            success: true,
            message: "All Channels fetched !",
            channels: result || [],
        })
    } catch (error) {
        next(error)
    }
}

const removeChannel = async (req, res, next) => {
    try {
        const { channelId } = req.body;
        await ChannelModel.findByIdAndDelete(channelId);
        await channelMessageModel.deleteMany({ channelId });

        return res.status(200).json({
            success: true,
            message: "Channel Deleted !",
        })
    } catch (error) {
        next(error)
    }
}

const removeChannelMember = async (req, res, next) => {
    try {
        const { channelId, memberId } = req.body;
        await ChannelModel.updateOne(
            { _id: channelId },
            { $pull: { members: memberId } },
            { upsert: true },
        )

        return res.status(200).json({
            success: true,
            message: "Member Deleted !",
        })
    } catch (error) {
        next(error)
    }
}


export { getChats, addContact, getAllContacts, removeContact, createChannel, getAllChannels, getChannelChats, removeChannel, removeChannelMember }