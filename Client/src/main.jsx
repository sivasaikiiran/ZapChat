import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { AuthPage, PrivatePage, ProfilePage, ChatPage, MessageContainerPage, ContactsPage, ResponsivePage } from "./pages/index.js"
import Layout from './Layout.jsx'
import { Provider } from "react-redux"
import { store, persistor } from './store/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketProvider } from './context/socketContext.jsx'
import { Modal } from '@mui/material'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Layout />} >
            <Route path='auth' element={<AuthPage />} />
            <Route path='profile'
                element={
                    <PrivatePage>
                        <ProfilePage />
                    </PrivatePage>
                }
            />
            <Route
                path='/'
                element={
                    <PrivatePage>
                        <ChatPage />
                    </PrivatePage>
                }
            />
            <Route
                path='/messageContainer'
                element={
                    <PrivatePage>
                        <ResponsivePage>
                            <MessageContainerPage />
                        </ResponsivePage>
                    </PrivatePage>
                }
            />
            <Route
                path='/contacts'
                element={
                    <PrivatePage>
                        <ResponsivePage>
                            <ContactsPage />
                        </ResponsivePage>
                    </PrivatePage>
                }
            />
        </Route>
    )
)

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <SocketProvider>
                <RouterProvider router={router}>
                </RouterProvider>
            </SocketProvider>
        </PersistGate>
    </Provider>
)
