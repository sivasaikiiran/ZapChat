import React from 'react'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
const Logo = () => {
    return (
        <div>
            <header className='font-bold font-raleway sm:text-2xl md:text-4xl p-1 flex justify-start items-center gap-2 flex-wrap bg-slate-700 rounded-md shadow-2xl shadow-slate-800'>
                <span className='flex gap-2 ml-2 flex-wrap items-center p-2'>
                    <WhatsAppIcon sx={{
                        fontSize: "2.5rem",
                        color: "aqua",
                    }} />
                    <span className='text-sm sm:text-xl md:text-4xl roboto-medium-italic'>
                        ZapChat
                    </span>
                </span>
            </header>
        </div>
    )
}

export default Logo
