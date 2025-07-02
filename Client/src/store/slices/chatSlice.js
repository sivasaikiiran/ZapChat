import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currChatUser: null,
    currChatChannel: null,
    currChatMessages: [],
    currChannelMessages: [],
    friendChats: [],
    friendChannels: [],
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setCurrentChat: (state, action) => {
            state.currChatUser = action.payload
        },
        setCurrentMessages: (state, action) => {
            state.currChatMessages = action.payload
        },
        setFriendChats: (state, action) => {
            state.friendChats = action.payload || [];
        },
        addChatMessages: (state, action) => {
            state.currChatMessages.push(action.payload);
        },
        addFriendChat: (state, action) => {
            state.friendChats = state.friendChats.filter((item) => item._id !== action.payload._id);
            state.friendChats.push(action.payload);
        },
        removeFriendChat: (state, action) => {
            state.friendChats = state.friendChats.filter((item) => item._id !== action.payload);

            if (state.friendChats.length === 0) {
                state.currChatUser = null
                state.currChatMessages = []
            }
        },
        resetFriendChats: (state, action) => {
            state.friendChats = [];
        },
        logoutChat: (state, action) => {
            state.currChatUser = null,
                state.currChatChannel = null,
                state.currChatMessages = [],
                state.currChannelMessages = [],
                state.friendChats = [],
                state.friendChannels = []
        },

        setCurrentChannel: (state, action) => {
            state.currChatChannel = action.payload
        },
        setFriendChannels: (state, action) => {
            state.friendChannels = action.payload || [];
        },
        addFriendChannel: (state, action) => {
            state.friendChannels = state.friendChannels.filter((channel) => channel._id != action.payload._id);
            state.friendChannels.push(action.payload);
        },
        addChannelMessages: (state, action) => {
            state.currChannelMessages.push(action.payload);
        },
        setCurrentChannelMessages: (state, action) => {
            state.currChannelMessages = action.payload
        },
        removeFriendChannel: (state, action) => {
            state.friendChannels = state.friendChannels.filter((item) => item._id != action.payload);

            if (state.friendChannels.length === 0) {
                state.currChatChannel = null
                state.currChannelMessages = []
            }
        },
    }

})

export default chatSlice.reducer

export const
    {
        setCurrentChat, addFriendChat, removeFriendChat, resetFriendChats, setCurrentMessages, logoutChat, addChatMessages, setFriendChats,

        setCurrentChannel, addFriendChannel, setFriendChannels, addChannelMessages,
        setCurrentChannelMessages,removeFriendChannel
    }

        = chatSlice.actions;
