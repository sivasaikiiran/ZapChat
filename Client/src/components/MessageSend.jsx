import React, { useEffect, useRef, useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PaletteIcon from '@mui/icons-material/Palette';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import { useSelector } from 'react-redux';
import { useSocket } from '../context/socketContext.jsx';
import { toast } from 'react-toastify';
import authService from '../Services/AuthService.js';

const MessageSend = () => {
    const user = useSelector((state) => state.user.userInfo);
    const currentChatUser = useSelector((state) => state.chat.currChatUser);
    const currentChatChannel = useSelector((state) => state.chat.currChatChannel);
    const section = useSelector((state) => state.section.section);
    const { socket } = useSocket();
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const emojiRef = useRef();
    const [inputText, setInputText] = useState("");
    const [file, setFile] = useState(null);
    const fileRef = useRef();


    useEffect(() => {
        const handleEmojiOpener = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setOpenEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleEmojiOpener)
        return () => {
            document.removeEventListener("mousedown", handleEmojiOpener);
        }
    }, [onmousedown])

    useEffect(() => {
        setInputText("");
        setFile(null);
    }, [currentChatUser, user])

    const sendMessageHandler = async () => {
        if (file && inputText) {
            toast.error('Cannot send both text and image at once !');
            setInputText("");
            setFile("");
            return;
        }

        let fileUrl = null;
        if (file) {
            const formData = new FormData();
            formData.append('imageFile', file);
            try {
                toast.warning('Uploading File !');
                const result = await authService.uploadImage(formData);
                if (result.data) {
                    // success
                    const { data: { imageDetails: { secure_url, public_id } } } = result;
                    console.log("uploaded url : ", secure_url);
                    fileUrl = secure_url;
                    toast.success('File uploaded !');
                }
                else {
                    //error
                    const { response: { data: { message } } } = result;
                    console.log(message)
                    toast.error('Cannot upload File !');
                }
            } catch (error) {
                console.log(error)
                toast.error('Cannot upload File !');
            }
        }

        if (inputText) {
            if (section === 'contact') {
                await socket.current.emit('sendMessage', {
                    sender: user._id,
                    recipent: currentChatUser._id,
                    messageType: 'text',
                    content: inputText
                })
            }
            else {
                await socket.current.emit('sendChannelMessage', {
                    sender: user._id,
                    channelId: currentChatChannel._id,
                    messageType: 'text',
                    content: inputText,
                    senderName: `${user.firstName} ${user.lastName}`
                })
            }

            setInputText("");
            setFile("");
        }
        else if (fileUrl) {
            if (section === 'contact') {
                await socket.current.emit('sendMessage', {
                    sender: user._id,
                    recipent: currentChatUser._id,
                    messageType: 'file',
                    fileUrl
                })
            }
            else {
                await socket.current.emit('sendChannelMessage', {
                    sender: user._id,
                    channelId: currentChatChannel._id,
                    messageType: 'file',
                    fileUrl,
                    senderName: `${user.firstName} ${user.lastName}`
                })
            }

            setInputText("");
            setFile("");
        }
        else {
            toast.warning("Cannot Send Empty Message !");
        }
    }
    return (
        <div className='flex justify-center items-center h-20 p-2 gap-2 '>
            <div className=' bg-slate-700 flex justify-center items-center rounded-md h-14 relative mb-2'>
                <input type="text"
                    className='bg-transparent p-4 text-lg focus:outline-none focus:border-none w-36 sm:w-56 md:w-96 rounded-md'
                    placeholder='Enter Message'
                    value={inputText}
                    onChange={(event) => setInputText(event.target.value)}
                />
                <div className='p-1 md:p-3 flex gap-2'>
                    <div onClick={() => fileRef.current.click()}>
                        <input
                            type="file"
                            name="messageFile"
                            id="messageFile"
                            className="hidden"
                            ref={fileRef}
                            onChange={(event) => {
                                setFile(event.target.files[0])
                                toast.success('File Selected !');
                            }
                            }
                        />
                        <AttachFileIcon className='cursor-pointer hover:text-slate-300' />
                    </div>
                    <div onClick={() => setOpenEmojiPicker((prev) => !prev)}>
                        <PaletteIcon className='cursor-pointer hover:text-slate-300' />
                    </div>
                </div>
                <div className='absolute -right-[3rem] -top-[19rem] duration-100 transition-all' ref={emojiRef}>
                    <EmojiPicker
                        height={280}
                        width={280}
                        open={openEmojiPicker}
                        lazyLoadEmojis={true}
                        previewConfig={{
                            showPreview: false
                        }}
                        onEmojiClick={(emojiData) => {
                            setInputText((prev) => prev + emojiData.emoji);
                            // console.log("Emoji :", emojiData.emoji)
                        }}
                    />
                </div>

            </div>

            <div className='bg-violet-600 flex justify-center items-center rounded-md h-14 p-3 md:p-5 cursor-pointer hover:bg-violet-700 transition-all duration-100 mb-2'
                onClick={sendMessageHandler}
            >
                <SendIcon className='cursor-pointer' />
            </div>
        </div>
    )
}

export default MessageSend
