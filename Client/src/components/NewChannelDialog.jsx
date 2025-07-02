import React, { useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Discuss } from 'react-loader-spinner'
import contactService from '../Services/ContactService';
import { toast } from 'react-toastify';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import { Input } from "./index.js"
import { setCurrentChat, addFriendChat, setCurrentChannel, addFriendChannel } from '../store/slices/chatSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import chatService from '../Services/ChatService.js';
import { useSocket } from '../context/socketContext.jsx';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';


const NewChannelDialog = ({ open, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchItem, setSearchItem] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const { socket } = useSocket();
    const [selectedContact, setSelectedContact] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getAllContacts = async () => {
            setLoading(true);
            try {
                const result = await contactService.getContact(searchItem);
                setLoading(false);
                if (!result.data) {
                    throw new Error(result);
                }
                else {
                    // success
                    const { data: { message, searchedContacts } } = result;
                    setSearch(searchedContacts);
                }
            } catch (error) {
                setLoading(false)
                toast.error('Cannot Fetch Contacts!');
                console.log(error)
            }
        }

        getAllContacts();
    }, [searchItem])

    const handleAddContact = async (contact) => {
        // try {
        //     setLoading(true);
        //     const result = await chatService.addContact(user._id, contact._id);
        //     setLoading(false);
        //     if (result.data) {
        //         // success
        //         const { data: { message } } = result;
        //         toast.success(message);
        //         dispatch(setCurrentChat(contact));
        //         dispatch(addFriendChat(contact));

        //         await socket.current.emit('addFriend', { userId: user._id, friendId: contact._id });
        //         onClose();
        //     }
        //     else {
        //         // error
        //         const { response: { data: { message } } } = result;
        //         toast.error(message);
        //         onClose();
        //     }
        // } catch (error) {
        //     setLoading(false);
        //     const { response: { data: { message } } } = result;
        //     toast.error(message);
        //     onClose();
        // }

        setSelectedContact((prev) => {
            if (prev.length >= 5) {
                toast.warning('Cannot Add more than 5 members at once !');
                return prev;
            }
            prev = prev.filter((member) => member._id !== contact._id);
            prev.push(contact);
            return prev;
        })
    }

    const removeMember = (contact) => {
        setSelectedContact((prev) => prev.filter((member) => member._id !== contact._id));
    }

    const createChannel = async () => {
        if (channelName.length === 0) {
            toast.error('Please provide a Channel name!');
            setSelectedContact([]);
            setChannelName("");
            return;
        }

        setLoading(true)

        try {
            const result = await chatService.createChannel(user._id, [...selectedContact, user], channelName);
            if (result.data) {
                // success
                const { data: { message, channel } } = result;
                toast.success(message);
                console.log("Channel :", channel);
                dispatch(setCurrentChannel(channel));
                dispatch(addFriendChannel(channel));

                await socket.current.emit('addChannel', channel);
            }
            else {
                // error
                const { response: { data: { message } } } = result;
                toast.error(message);
            }
        } catch (error) {
            const { response: { data: { message } } } = result;
            toast.error(message);
        }


        setLoading(false);
        setSelectedContact([]);
        setChannelName([]);
        onClose();
    }


    return (
        <>
            <Dialog onClose={onClose} open={open} className='overflow-y-scroll srollbar-hidden'
                style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                }}>
                <DialogTitle className='bg-slate-700 text-white'>
                    <Input
                        type='text'
                        placeholder='Channel Name'
                        className="text-md border-none outline-none p-2 rounded-md bg-slate-800 text-white"
                        onChange={(event) => {
                            setChannelName(event.target.value)
                        }}
                    />
                    <p className='text-center'>Create New Channel</p>

                </DialogTitle>
                {selectedContact.length > 0 && <div className='bg-slate-700 flex justify-center items-center flex-col'>
                    <div className='flex justify-center items-center gap-2 bg-transparent flex-wrap max-w-64'>
                        {
                            selectedContact.map((member) => {
                                return (
                                    <div key={member._id} className='my-1 px-2 py-1 bg-violet-600 text-white rounded-md'>
                                        <span className='text-sm'>{member.firstName}</span>
                                        <IconButton
                                            onClick={() => removeMember(member)}
                                        >
                                            <CloseIcon
                                                sx={{
                                                    color: "white",
                                                    fontSize: "20px",
                                                    marginRight: "-0.5rem",
                                                }}
                                            />
                                        </IconButton>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <button
                        className='my-1 px-2 py-1 bg-[#ff0033] text-white rounded-md'
                        onClick={createChannel}
                    >
                        Create Channel
                    </button>

                </div>}
                {
                    loading ?
                        <div className='bg-slate-700 flex justify-center'>
                            <Discuss
                                ariaLabel="loading"
                            />
                        </div> :
                        <>
                            <List sx={{ pt: 0 }} className='bg-slate-700 text-white overflow-y-scroll srollbar-hidden'
                                style={{
                                    msOverflowStyle: "none",
                                    scrollbarWidth: "none",
                                }}
                            >
                                {search.length ?
                                    search.map((item) => (
                                        <ListItem disableGutters key={item._id}>
                                            <ListItemButton onClick={() => {
                                                handleAddContact(item);
                                                // dispatch(setCurrentChat(item));
                                                // dispatch(addFriendChat(item));
                                                // onClose();
                                            }}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <img src={item.imageUrl} alt="Profile-pic" className='bg-cover h-full w-full' />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    secondaryTypographyProps={{
                                                        color: '#C4DAD2'
                                                    }}
                                                    primary={`${item.firstName} ${item.lastName}`} secondary={item.email}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                    :
                                    <h1 className='text-center font-bold mt-2'>No Contacts...</h1>
                                }
                            </List>
                        </>
                }

            </Dialog>
        </>
    )
}

export default NewChannelDialog
