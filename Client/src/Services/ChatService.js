import axios from "axios"
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


class ChatService {

    async getChats(senderId, recipentId) {
        try {
            return await axios.post(`/chat/getChats`, {
                senderId,
                recipentId
            }, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async getChannelChats(channelId) {
        try {
            return await axios.post(`/chat/getChannelChats`, {
                channelId,
            }, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async getChannels(userId) {
        try {
            return await axios.post(`/chat/getChannels`, {
                userId
            }, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async addContact(userId, friendId) {
        try {
            return await axios.post(`/chat/addContact`, {
                userId,
                friendId
            }, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async createChannel(userId, members, channelName) {
        try {
            return await axios.post(`/chat/createChannel`, {
                userId,
                members,
                channelName
            }, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async removeContact(userId, friendId) {
        try {
            return await axios.post(`/chat/removeContact`, {
                userId,
                friendId
            }, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async removeChannel(channelId) {
        try {
            return await axios.post(`/chat/removeChannel`, {
                channelId
            }, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async removeChannelMember(channelId, memberId) {
        try {
            return await axios.post(`/chat/removeChannelMember`, {
                channelId,
                memberId
            }, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async getAllContacts(userId) {
        try {
            return await axios.post(`/chat/getContacts`, {
                userId
            }, { withCredentials: true })
        } catch (error) {
            return error;
        }
    }
}

const chatService = new ChatService(); // object creation

export default chatService;