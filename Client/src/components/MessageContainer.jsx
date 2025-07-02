import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import chatService from '../Services/ChatService.js';
import { toast } from 'react-toastify';
import { setCurrentChannelMessages, setCurrentMessages } from '../store/slices/chatSlice.js';
import { Message, Loader } from "./index.js"

const MessageContainer = () => {
  const user = useSelector((state) => state.user.userInfo);
  const currentChatUser = useSelector((state) => state.chat.currChatUser);
  const currentChatMessages = useSelector((state) => state.chat.currChatMessages);
  const currentChatChannel = useSelector((state) => state.chat.currChatChannel);
  const currentChannelMessages = useSelector((state) => state.chat.currChannelMessages);
  const section = useSelector((state) => state.section.section);
  const dispatch = useDispatch();
  const messageEndRef = useRef();
  const [currDate, setCurrDate] = useState("");
  const dateMap = new Map();
  const [loadMessage, setLoadMessage] = useState(false);

  useEffect(() => {
    if (currDate) console.log(currDate.current)
  }, [currDate])

  useEffect(() => {
    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    scrollToBottom();
  }, [currentChatMessages, currentChannelMessages])

  useEffect(() => {

    if (currentChatUser) {

      const getAllChats = async () => {
        setLoadMessage(true);
        try {
          const result = await chatService.getChats(user._id, currentChatUser._id)
          setLoadMessage(false);

          if (result.data) {
            // success
            const { data: { chatMessages } } = result;
            dispatch(setCurrentMessages(chatMessages));
          }
          else {
            // error
            const { response: { data: { message } } } = result;
            toast.error(message);
          }
        } catch (error) {
          setLoadMessage(false);
          console.log(error)
          toast.error("Cannot fetch messages !")
        }
      }

      getAllChats();
    }

  }, [currentChatUser])

  useEffect(() => {

    if (currentChatChannel) {

      const getAllChannelChats = async () => {
        setLoadMessage(true);
        try {
          const result = await chatService.getChannelChats(currentChatChannel._id)
          setLoadMessage(false);

          if (result.data) {
            // success
            const { data: { channelMessages } } = result;
            dispatch(setCurrentChannelMessages(channelMessages));
          }
          else {
            // error
            const { response: { data: { message } } } = result;
            toast.error(message);
          }
        } catch (error) {
          setLoadMessage(false);
          console.log(error)
          toast.error("Cannot fetch messages !")
        }
      }

      getAllChannelChats();
    }

  }, [currentChatChannel])

  const sendDate = (message) => {
    const messageDate = new Date(message.createdAt).toLocaleDateString();
    if (currDate === "" || currDate !== messageDate) {
      setCurrDate(messageDate);
      return (
        <div className="text-center p-2 text-xl text-red-500">
          {messageDate}
        </div>
      );
    }

    return null;
  };

  if (section === 'contact') {
    return (
      <div className='overflow-y-scroll srollbar-hidden p-10 h-[80vh] bg-slate-800'
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}>
        {
          currentChatMessages?.length ?
            <div>
              {
                currentChatMessages.map((item) => {

                  const messageDate = new Date(item.createdAt).toLocaleDateString('en-us', { month: "short", day: "numeric", year: "numeric" })
                  let date = null;
                  if (!dateMap.get(messageDate)) {
                    dateMap.set(messageDate, 1);
                    date = messageDate;
                  }

                  return (
                    <div key={item._id} className='my-3'>
                      {
                        date &&
                        <div className='text-center p-2 text-xs sm:text-sm md:text-xl text-white h-10 w-full my-3 flex justify-center items-center'>
                          <span className='border-2 p-2 bg-slate-500'>
                            {date}
                          </span>
                        </div>
                      }
                      <div className={`flex items-center ${item.sender == user._id ? "justify-end" : "justify-start"}`}>
                        {
                          item.content ? <Message msg={item.content} className={`text-justify p-2 ${item.sender == user._id ? "bg-[#ff5087]" : "bg-[#ff2a1f]"} font-semibold rounded-md max-w-[16rem] min-w-[5rem] text-xs sm:text-sm md:text-xl`} /> :
                            <div
                              className={`p-2 border-2 font-semibold rounded-md max-w-[16rem] min-w-[5rem] text-xs sm:text-sm md:text-xl`}
                            >
                              <a href={item.fileUrl} target='_blank'>
                                <img
                                  src={item.fileUrl}
                                  alt="fileImage"
                                  className='h-[10rem] w-[15rem]'
                                  onError={(event) => {
                                    console.log(item.fileUrl)
                                    event.target.setAttribute('src', "https://pnghq.com/wp-content/uploads/folder-png-transparent-background.png");
                                  }}
                                />
                              </a>
                              <span className='text-sm'>Click to View the File</span>
                            </div>
                        }
                        {/* <Message msg={item.content ? item.content : item.fileUrl} className={`text-justify p-2 ${item.sender == user._id ? "bg-[#ff5087]" : "bg-[#ff2a1f]"} font-semibold rounded-md max-w-[16rem] min-w-[5rem] text-xs sm:text-sm md:text-xl`} /> */}
                        {/* FF6961 receiver*/}
                        {/* f5004f  sender*/}
                      </div>
                      <div className={`flex items-center ${item.sender == user._id ? "justify-end" : "justify-start"} text-xs sm:text-sm md:text-xl`}>
                        {
                          new Date(item.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                          })
                        }
                      </div>
                    </div>
                  )
                })
              }
              <div ref={messageEndRef} />
            </div>
            :
            <>
              {
                loadMessage ? <h1 className='text-center text-xl font-raleway'>Loading Messages...!</h1> : <h1 className='text-center text-xl font-raleway'>Start To Chat by typing something !</h1>
              }
            </>
        }
      </div>
    )
  }


  return (
    <div className='overflow-y-scroll srollbar-hidden p-10 h-[80vh] bg-slate-800'
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}>
      {
        currentChannelMessages?.length ?
          <div>
            {
              currentChannelMessages.map((item) => {
                const messageDate = new Date(item.createdAt).toLocaleDateString('en-us', { month: "short", day: "numeric", year: "numeric" })
                let date = null;
                if (!dateMap.get(messageDate)) {
                  dateMap.set(messageDate, 1);
                  date = messageDate;
                }

                return (
                  <div key={item._id} className='my-3'>
                    {
                      date &&
                      <div className='text-center p-2 text-xs sm:text-sm md:text-xl text-white h-10 w-full my-3 flex justify-center items-center'>
                        <span className='border-2 p-2 bg-slate-500'>
                          {date}
                        </span>
                      </div>
                    }
                    <div className={`flex items-center ${item.sender == user._id ? "justify-end" : "justify-start"}`}>
                      {
                        item.content ?
                          <>
                            <Message msg={item.content} className={`text-justify p-2 ${item.sender == user._id ? "bg-[#ff5087]" : "bg-[#ff2a1f]"} font-semibold rounded-md max-w-[16rem] min-w-[5rem] text-xs sm:text-sm md:text-xl`}
                              senderName={item.senderName}
                            />
                          </>
                          :
                          <div
                            className={`p-2 border-2 font-semibold rounded-md max-w-[16rem] min-w-[5rem] text-xs sm:text-sm md:text-xl`}
                          >
                            <div className='text-xs font-bold p-1
                             max-w-[100px]'>
                              {item.senderName}
                            </div>
                            <a href={item.fileUrl} target='_blank'>
                              <img
                                src={item.fileUrl}
                                alt="fileImage"
                                className='h-[10rem] w-[15rem]'
                                onError={(event) => {
                                  console.log(item.fileUrl)
                                  event.target.setAttribute('src', "https://pnghq.com/wp-content/uploads/folder-png-transparent-background.png");
                                }}
                              />
                            </a>
                            <span className='text-sm'>Click to View the File</span>
                          </div>
                      }
                      {/* <Message msg={item.content ? item.content : item.fileUrl} className={`text-justify p-2 ${item.sender == user._id ? "bg-[#ff5087]" : "bg-[#ff2a1f]"} font-semibold rounded-md max-w-[16rem] min-w-[5rem] text-xs sm:text-sm md:text-xl`} /> */}
                      {/* FF6961 receiver*/}
                      {/* f5004f  sender*/}
                    </div>
                    <div className={`flex items-center ${item.sender == user._id ? "justify-end" : "justify-start"} text-xs sm:text-sm md:text-xl`}>
                      {
                        new Date(item.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })
                      }
                    </div>
                  </div>
                )
              })
            }
            <div ref={messageEndRef} />
          </div>
          :
          <>
            {
              loadMessage ? <h1 className='text-center text-xl font-raleway'>Loading Messages...!</h1> : <h1 className='text-center text-xl font-raleway'>Start To Chat by typing something !</h1>
            }
          </>
      }
    </div>
  )

}


export default MessageContainer

