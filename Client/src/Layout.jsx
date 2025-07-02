import React from 'react'
import { Outlet } from 'react-router-dom'
import "./index.css"
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Layout() {
    return (
        <div className='h-screen overflow-hidden'>
            <Outlet />
            <ToastContainer
                position="top-right"
                autoClose={4000}
                transition={Bounce}
            />
        </div>
    )
}


export default Layout
