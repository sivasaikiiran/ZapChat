import React, { useState } from 'react'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'
import chatService from '../Services/ChatService'
import { useDispatch, useSelector } from 'react-redux'
import { removeFriendChannel, removeFriendChat, setCurrentChannel, setCurrentChannelMessages, setCurrentChat, setCurrentMessages } from '../store/slices/chatSlice'
import { useSocket } from '../context/socketContext'

const Modal = ({ msg, setShowModal, id = "", channel = "" }) => {

    const user = useSelector((state) => state.user.userInfo);
    const currentChatUser = useSelector((state) => state.chat.currChatUser);
    const currentChatChannel = useSelector((state) => state.chat.currChatChannel);
    const dispatch = useDispatch();
    const [wait, setWait] = useState(false);
    const { socket } = useSocket();
    const section = useSelector((state) => state.section.section);

    const deleteHandler = async () => {
        if (!id) {
            setShowModal(false);
            toast.error('No contact Deleted !');
            return;
        }
        try {
            setWait(true);
            const result = await chatService.removeContact(user._id, id);
            setWait(false);
            if (result.data) {
                // success deletion
                toast.success('Contact Deleted!')
                dispatch(removeFriendChat(id));
                if (currentChatUser?._id == id) {
                    dispatch(setCurrentChat(null));
                    dispatch(setCurrentMessages([]));
                }

                await socket.current.emit('removeFriend', { userId: user._id, friendId: id });
            }
            else {
                toast.error('Error! Could not delete Contact... Try Again later');
                const { response: { data: { message } } } = result;
                toast.error(message);
            }
        } catch (error) {
            setWait(false);
            toast.error('Cannot Delete');
            console.log(error)
        }

        setShowModal(false);
    }

    const deleteChannelHandler = async () => {
        if (!channel) {
            setShowModal(false);
            toast.error('No Channel Deleted !');
            return;
        }
        try {
            setWait(true);
            let result;
            if (user._id === channel.admin) {
                result = await chatService.removeChannel(channel._id);
            }
            else {
                result = await chatService.removeChannelMember(channel._id, user._id);
            }
            setWait(false);
            if (result.data) {
                // success deletion
                toast.success('Channel Deleted!')
                dispatch(removeFriendChannel(channel._id));

                if (user._id === channel.admin)
                    await socket.current.emit('removeFriendChannel', channel);
                
                if (currentChatChannel?._id == channel._id) {
                    dispatch(setCurrentChannel(null));
                    dispatch(setCurrentChannelMessages([]));
                }

            }
            else {
                toast.error('Error! Try Again later');
                const { response: { data: { message } } } = result;
                toast.error(message);
            }
        } catch (error) {
            setWait(false);
            toast.error('Error! Try Again Later!');
            console.log(error)
        }

        setShowModal(false);
    }


    return (
        <div className='h-screen w-screen flex justify-center items-center'
            style={{
                scrollbarWidth: "none"
            }}
        >
            <div className='bg-slate-800 text-xl font-raleway max-w-80 rounded-md p-2'>
                <div className='p-3 tracking-wider'>
                    <h1>{msg}</h1>
                </div>
                <div className='flex justify-around items-center my-4'>
                    <Button sx={{
                        bgcolor: "white",
                        color: "black",
                        ":hover": {
                            bgcolor: "rgb(203,213,225) ",
                        }
                    }}
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button sx={{
                        bgcolor: "#dc2626",
                        color: "white",
                        ":hover": {
                            bgcolor: "#b91c1c",
                        }
                    }}
                        onClick={section === 'contact' ? deleteHandler : deleteChannelHandler}
                        disabled={wait}
                    >
                        {wait ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Modal
