import { Server } from 'socket.io'
import MessageModel from '../models/MessageModel.js';
import UserModel from '../models/UserModel.js';
import channelMessageModel from '../models/ChannelMessage.js';
import ChannelModel from '../models/ChannelModel.js';

const setupSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "https://chat-app-rho-swart.vercel.app"],
            credentials: true,
        },
    })

    const userSocketMap = new Map();

    io.on('connection', (socket) => {
        const { userId } = socket.handshake.query;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User with userId : ${userId} connected to socket Id : ${socket.id}`)
        }
        else {
            console.log(`User Id not provided`)
        }

        const disconnectSocket = (socket) => {
            console.log(`Client Disconnected with socketId ${socket.id}`)
            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        }

        const sendMessage = async (message) => {
            // always created
            const createdMessage = await MessageModel.create(message);


            const senderSocketId = userSocketMap.get(message.sender);
            const recipentSocketId = userSocketMap.get(message.recipent);

            if (recipentSocketId) {
                // recipent is online
                const updatedMessage = await MessageModel.findByIdAndUpdate(createdMessage._id, { delivered: true }, {
                    new: true
                });
                // message recived
                io.to(recipentSocketId).emit('receiveMessage', updatedMessage);
            }

            // i have sent the message --> right side show
            io.to(senderSocketId).emit('receiveMessage', createdMessage);

        }
        socket.on('sendMessage', sendMessage);

        const sendChannelMessage = async ({ senderName, ...message }) => {
            const channelMessage = await channelMessageModel.create(message);
            console.log("Channel Message : ", channelMessage)
            const { members } = await ChannelModel.findById(message.channelId);

            members.forEach(member => {

                const memberSocketId = userSocketMap.get(member)
                // check if this member is online
                if (memberSocketId) {
                    io.to(memberSocketId).emit('receiveChannelMessage', { ...channelMessage._doc, senderName });
                }
            });

        }

        socket.on('sendChannelMessage', sendChannelMessage);

        const handleAddFriend = async ({ userId, friendId }) => {
            // add userId to frinedList of friendId

            const userSocketId = userSocketMap.get(userId);
            const friendSocketId = userSocketMap.get(friendId);

            if (friendSocketId) {
                const user = await UserModel.findById(userId);
                const { password: hashedPassword, ...restDetails } = user._doc;

                io.to(friendSocketId).emit('addFriend', {
                    friend: restDetails
                })
            }
        }

        socket.on('addFriend', handleAddFriend);

        const handleAddChannel = async (channel) => {
            const { members } = channel;
            members.forEach(member => {

                const memberSocketId = userSocketMap.get(member)
                // check if this member is online
                if (memberSocketId) {
                    io.to(memberSocketId).emit('addChannel', channel);
                }
            });
        }

        socket.on('addChannel', handleAddChannel);

        const handleRemoveFriend = async ({ userId, friendId }) => {
            const userSocketId = userSocketMap.get(userId);
            const friendSocketId = userSocketMap.get(friendId);

            if (friendSocketId) {
                io.to(friendSocketId).emit('removeFriend', {
                    friendId: userId
                })
            }
        }

        socket.on('removeFriend', handleRemoveFriend);

        const handleRemoveFriendChannel = async (channel) => {
            const { members } = channel;
            members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member);

                if (memberSocketId) {
                    io.to(memberSocketId).emit('removeFriendChannel', channel);
                }
            })
        }

        socket.on('removeFriendChannel', handleRemoveFriendChannel);

        // on event : describing the event on which when fired (emit) by the client
        // the particular callback is called . 
        // example- on client connection, after 4seconds, the server itself fires(emits) the message event to client. Now, the client should handle this event named 'message' and get the required data
        // setTimeout(() => {
        //     socket.emit('message', {
        //         msg : "Fuck OFF !"
        //     })
        // }, 4000);
        socket.on('disconnect', () => disconnectSocket(socket));
    })
}

export default setupSocket;