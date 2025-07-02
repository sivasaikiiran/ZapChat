import React, { useState, useEffect } from 'react'
import { Contacts, Chatbox, ChatWelcome } from "./index.js"
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ChatLayout = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const currentChatUser = useSelector((state) => state.chat.currChatUser);

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
      windowWidth > "890" ?
        <>
          <div
            className='bg-slate-900 min-h-screen w-screen overflow-hidden'
            style={{
              display: "grid",
              gridTemplateColumns: '1fr 3fr'
            }}
          >
            <Contacts />
            <Chatbox />
          </div>
        </>
        :
        <>
          {
            currentChatUser ? <Navigate to={'/messageContainer'} />
              : <Navigate to={'/contacts'} />
          }
        </>
    }
  </>

  // <div
  //   className='bg-slate-900 min-h-screen w-screen overflow-hidden'
  //   style={{
  //     display: "grid",
  //     gridTemplateColumns: '1fr 3fr'
  //   }}
  // >
  //   <Contacts />
  //   <Chatbox />
  // </div>
}

export default ChatLayout
