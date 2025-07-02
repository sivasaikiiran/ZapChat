import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const PrivatePage = ({ children }) => {

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    return isAuthenticated ? (
        <>
            {children}
        </>
    ) : <Navigate to='/auth' />
}

export default PrivatePage
