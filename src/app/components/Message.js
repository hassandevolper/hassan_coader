'use client';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
const Messages = ({ intialmessage, sessionid,sessionimg,chatpartnerimg }) => {
  const scrolldownRef = useRef();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(intialmessage || []); // Initialize messages
  }, [intialmessage]);

  useEffect(() => {
    // Scroll to the bottom when new messages arrive
    if (scrolldownRef.current) {
      scrolldownRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      className="flex h-full flex-1 flex-col-reverse gap-4 p-4 overflow-y-auto scrollbar-thumb-gray-400 scrollbar-thumb-rounded scrollbar-track-gray-200 scrollbar-w-2 scrolling-touch"
      id="messages"
    >
      <div ref={scrolldownRef}></div>
      {messages.map((message, index) => {
        const isCurrentUser = message.senderid === sessionid;
        const isNextMessageFromSameUser =
          index > 0 && messages[index - 1]?.senderid === message.senderid;

        return (
          <div
            className={`chat-message flex ${
              isCurrentUser ? 'justify-end' : 'justify-start'
            }`}
            key={`${message.id}-${message.timestamp}`}
          >
            <div className="flex flex-col max-w-xs space-y-1">
              <span
                className={`px-4 py-2 rounded-xl text-base shadow-md ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white self-end'
                    : 'bg-gray-900 text-gray-100 self-start'
                } ${
                  !isNextMessageFromSameUser && isCurrentUser
                    ? 'rounded-br-none'
                    : ''
                } ${
                  !isNextMessageFromSameUser && !isCurrentUser
                    ? 'rounded-bl-none'
                    : ''
                }`}
              >
                {message.text}
              </span>
              <span
                className={`text-xs text-gray-500 ${
                  isCurrentUser ? 'text-right' : 'text-left'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <div></div>
            </div>
            {/* different between invisible and hidden in invisible it accupy its normal but not show to user */}
            <div className={`relative w-6 h-6
                ${isCurrentUser ? "order-2": "order-1"}
                ${isNextMessageFromSameUser ? "invisible" : "visible"}`}>
               <Image
               fill 
               referrerPolicy='no-referrer'
               src = {`${isCurrentUser ? sessionimg  : chatpartnerimg}`}
               alt='Profile picture'
               className='rounded-full'
               />

                </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
