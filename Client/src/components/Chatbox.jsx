import React from 'react'
import { ChatHeader, MessageContainer, MessageSend } from "./index.js"
import { useSelector } from 'react-redux';
import LOGO from "../../public/CHATLOGO.jpg"

const Chatbox = () => {

  const currentChatUser = useSelector((state) => state.chat.currChatUser);
  const currentChatChannel = useSelector((state) => state.chat.currChatChannel);
  const section = useSelector((state) => state.section.section);

  if (section === 'contact') {
    return (currentChatUser) ? <><div className='text-white font-raleway relative
  '>
      <ChatHeader />
      <MessageContainer />
      <MessageSend />
    </div></> : <div>
        <img src={LOGO} alt="LOGO" className='object-fit w-full h-screen' />
    </div>
  }

  return (currentChatChannel) ? <><div className='text-white font-raleway relative
  '>
    <ChatHeader />
    <MessageContainer />
    <MessageSend />
  </div></> : <div>
        <img src={LOGO} alt="LOGO" className='object-fit w-full h-screen' />
    </div>

  // return (
  //   <div className='text-white font-raleway relative
  //   '>
  //     <ChatHeader />
  //     <MessageContainer />
  //     <MessageSend />
  //   </div>
  // )
}

export default Chatbox
