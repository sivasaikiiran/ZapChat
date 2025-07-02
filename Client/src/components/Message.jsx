import React from 'react'

const Message = ({ msg, className, senderName = "" }) => {
    return (
        <div>
            <div className='text-xs font-bold p-1
            max-w-[100px]'>{senderName}</div>
            <div className={className}>
                {msg}
            </div>
        </div>

    )
}

export default Message
