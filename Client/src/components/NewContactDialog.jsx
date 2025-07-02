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
import { setCurrentChat, addFriendChat } from '../store/slices/chatSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import chatService from '../Services/ChatService.js';
import { useSocket } from '../context/socketContext.jsx';


const NewContactDialog = ({ open, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchItem, setSearchItem] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const { socket } = useSocket();

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
        try {
            setLoading(true);
            const result = await chatService.addContact(user._id, contact._id);
            setLoading(false);
            if (result.data) {
                // success
                const { data: { message } } = result;
                toast.success(message);
                dispatch(setCurrentChat(contact));
                dispatch(addFriendChat(contact));

                await socket.current.emit('addFriend', { userId: user._id, friendId: contact._id });
                onClose();
            }
            else {
                // error
                const { response: { data: { message } } } = result;
                toast.error(message);
                onClose();
            }
        } catch (error) {
            setLoading(false);
            const { response: { data: { message } } } = result;
            toast.error(message);
            onClose();
        }
    }


    return (
        <>
            <Dialog onClose={onClose} open={open}>
                <DialogTitle className='bg-slate-700 text-white'>
                    <Input
                        type='text'
                        placeholder='Search Contact'
                        className="text-md border-none outline-none p-2 rounded-md bg-slate-800 text-white"
                        onChange={(event) => {
                            setSearchItem(event.target.value)
                        }}
                    />
                    <p className='text-center'>Select New Contact</p>

                </DialogTitle>
                {
                    loading ?
                        <div className='bg-slate-700 flex justify-center'>
                            <Discuss
                                ariaLabel="loading"
                            />
                        </div> :
                        <>
                            <List sx={{ pt: 0 }} className='bg-slate-700 text-white'>
                                {/* {emails.map((email) => (
                                    <ListItem disableGutters key={email}>
                                        <ListItemButton onClick={() => handleListItemClick(email)}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={email} />
                                        </ListItemButton>
                                    </ListItem>
                                ))} */}
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

export default NewContactDialog
