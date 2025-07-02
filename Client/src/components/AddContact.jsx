import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { NewChannelDialog, NewContactDialog } from "./index.js"
import { useSelector } from 'react-redux';

const AddContact = ({ text }) => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div className='border-2 rounded-full'>
            <Tooltip title={`Add New ${text}`} arrow={true} placement='top'>
                <IconButton onClick={handleOpen}>
                    <AddIcon sx={{
                        color: "white",
                        fontSize: "15px"
                    }} />
                </IconButton>
            </Tooltip>
            {
                (text === 'Contact' && open) ?
                    <NewContactDialog open={open} onClose={handleClose} />
                    :
                    <NewChannelDialog open={open} onClose={handleClose} />
            }
        </div>
    )
}

export default AddContact
