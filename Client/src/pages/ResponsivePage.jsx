import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { ChatLayout } from "../components/index"

const ResponsivePage = ({ children }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    });

    return <>
        {
            windowWidth <= "890" ? children : (
                // <Navigate to={"/"} />
                <ChatLayout />
            )
        }
    </>
}

export default ResponsivePage
